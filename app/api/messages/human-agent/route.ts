import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { chatId, recipientPsid, message } = await request.json();
    
    // Validate required parameters
    if (!chatId || !recipientPsid || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters: chatId, recipientPsid, and message are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the chat details to verify it exists
    const { data: chatData, error: chatError } = await supabase
      .from('instagram_chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (chatError || !chatData) {
      return NextResponse.json(
        { error: 'Chat not found', details: chatError?.message },
        { status: 404 }
      );
    }

    // Make the API call to the Instagram service
    const apiUrl = `${process.env.INSTAGRAM_API_URL}/messages/human-agent`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INSTAGRAM_API_KEY}`
      },
      body: JSON.stringify({
        chatId,
        recipientPsid,
        message
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message to Instagram API');
    }

    const result = await response.json();

    // Store the message in the database
    const { data: messageData, error: messageError } = await supabase
      .from('instagram_messages')
      .insert({
        chat_id: chatId,
        instagram_message_id: result.message_id || `local-${Date.now()}`,
        sender_id: session.user.id,
        recipient_id: recipientPsid,
        type: 'human_agent',
        message_type: 'text',
        message_timestamp: Date.now(),
        metadata: {
          text: message
        }
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error storing message in database:', messageError);
      // Continue anyway since the message was sent to Instagram
    }

    // Update the chat's last_interaction timestamp
    await supabase
      .from('instagram_chats')
      .update({ last_interaction: new Date().toISOString() })
      .eq('id', chatId);

    return NextResponse.json({ 
      success: true, 
      result: result,
      message: messageData || null
    });
  } catch (error: any) {
    console.error('Error sending human agent message:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send human agent message',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 