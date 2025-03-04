"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const Home = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:py-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight mb-6">
                <span className="text-blue-600">Velya</span>
                <span className="block mt-2 text-gray-800 font-normal">AI-powered Instagram DM management</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                Handle high volumes of Instagram DMs with intelligent AI. Convert conversations into qualified leads effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push("/sign-up")} 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md text-base font-normal transition-all hover:shadow-lg"
                >
                  Get started
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const demoSection = document.getElementById('how-it-works');
                    demoSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white border-none text-gray-700 hover:text-blue-600 px-6 py-3 rounded-md text-base font-normal transition-colors"
                >
                  See how it works →
                </Button>
              </div>
            </div>
            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.1)]">
              <div className="absolute inset-0 bg-white flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gray-100 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto text-sm text-gray-500">Instagram Direct Messages</div>
                  </div>
                  <div className="absolute top-14 left-0 right-0 bottom-0 bg-gray-50 p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                            <div className="ml-3 bg-gray-200 rounded-2xl p-3 max-w-[70%]">
                              <p className="text-gray-600">Hi! I&apos;m interested in your services. Can you tell me more?</p>
                            </div>
                          </div>
                          <div className="flex items-start justify-end">
                            <div className="mr-3 bg-blue-100 rounded-2xl p-3 max-w-[70%]">
                              <p className="text-gray-800">Hello! Thanks for reaching out to Velya. I&apos;d be happy to tell you about our services. What specific aspects are you interested in?</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">V</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                            <div className="ml-3 bg-gray-200 rounded-2xl p-3 max-w-[70%]">
                              <p className="text-gray-600">I need help managing customer inquiries for my online store.</p>
                            </div>
                          </div>
                          <div className="flex items-start justify-end">
                            <div className="mr-3 bg-blue-100 rounded-2xl p-3 max-w-[70%]">
                              <p className="text-gray-800">Perfect! Our AI can handle customer inquiries 24/7, answer product questions, and collect lead information. Could I get your email to send you more details?</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">V</div>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 mt-4 bg-white rounded-full flex items-center px-4 shadow-sm">
                        <input type="text" className="flex-1 bg-transparent outline-none text-sm text-gray-600" placeholder="Type a message..." disabled />
                        <button className="ml-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 text-gray-900">How Velya transforms your Instagram DMs</h2>
          <p className="text-base text-gray-600 text-center mb-16 max-w-2xl mx-auto">Intelligent automation that feels personal</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-5">
                <Image src="/robot.png" alt="AI" width={48} height={48} className="h-12 w-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">AI-powered conversations</h3>
              <p className="text-gray-600 leading-relaxed">Our system uses advanced LLMs to handle conversations naturally and intelligently.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-5">
                <Image src="/chart.png" alt="Chart" width={48} height={48} className="h-12 w-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Lead information collection</h3>
              <p className="text-gray-600 leading-relaxed">Automatically extract and organize customer information from natural conversations.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-5">
                <Image src="/rocket.png" alt="Rocket" width={48} height={48} className="h-12 w-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">High volume handling</h3>
              <p className="text-gray-600 leading-relaxed">Scale your Instagram presence without scaling your team. Handle hundreds of conversations simultaneously.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 text-gray-900">Simple setup, powerful results</h2>
          <p className="text-base text-gray-600 text-center mb-16 max-w-2xl mx-auto">Four easy steps to transform your Instagram DM strategy</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm">1</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Connect Your Instagram</h3>
                    <p className="text-gray-600 leading-relaxed">Link your Instagram business account to our platform with just a few clicks. Secure OAuth integration ensures your account remains protected.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm">2</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Customize Your AI</h3>
                    <p className="text-gray-600 leading-relaxed">Set up your AI assistant with your brand voice, response templates, and the specific information you want to collect from leads.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm">3</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Let AI Handle Conversations</h3>
                    <p className="text-gray-600 leading-relaxed">Our AI responds to messages, qualifies leads, and collects important information. You can monitor conversations in real-time or review them later.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm">4</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Review Leads & Insights</h3>
                    <p className="text-gray-600 leading-relaxed">Access your dashboard to see qualified leads, conversation insights, and analytics. Export data to your CRM or contact leads directly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-white">
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gray-100 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto text-sm text-gray-500">Velya Dashboard</div>
                  </div>
                  <div className="absolute top-14 left-0 right-0 bottom-0 bg-gray-50 p-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">Lead Analytics</h3>
                        <div className="flex space-x-2">
                          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">This Week</div>
                          <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">This Month</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">New Leads</p>
                          <p className="text-xl font-bold text-gray-800">127</p>
                          <p className="text-xs text-green-600">+12% ↑</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Qualified</p>
                          <p className="text-xl font-bold text-gray-800">86</p>
                          <p className="text-xs text-green-600">+8% ↑</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Conversion</p>
                          <p className="text-xl font-bold text-gray-800">67%</p>
                          <p className="text-xs text-green-600">+5% ↑</p>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-50 rounded-lg flex items-end p-2">
                        <div className="w-1/7 h-[20%] bg-blue-200 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[40%] bg-blue-300 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[60%] bg-blue-400 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[80%] bg-blue-500 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[70%] bg-blue-400 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[50%] bg-blue-300 rounded-t-sm mx-1"></div>
                        <div className="w-1/7 h-[30%] bg-blue-200 rounded-t-sm mx-1"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-bold text-gray-800 mb-4">Recent Leads</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                              <p className="text-xs text-gray-500">sarah@example.com</p>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">Qualified</div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Michael Chen</p>
                              <p className="text-xs text-gray-500">michael@example.com</p>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">New</div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Emma Wilson</p>
                              <p className="text-xs text-gray-500">emma@example.com</p>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs">Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 text-gray-900">Benefits for your business</h2>
          <p className="text-base text-gray-600 text-center mb-16 max-w-2xl mx-auto">Tangible results that impact your bottom line</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg flex items-start">
              <Image src="/clock.png" alt="Clock" width={40} height={40} className="h-10 w-auto mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Save time & resources</h3>
                <p className="text-gray-600 leading-relaxed">Reduce the need for a large customer service team while still providing excellent response times.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg flex items-start">
              <Image src="/target.png" alt="Magnet" width={40} height={40} className="h-10 w-auto mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Never miss a lead</h3>
                <p className="text-gray-600 leading-relaxed">Capture every potential customer with 24/7 response capability and intelligent conversation handling.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg flex items-start">
              <Image src="/folder.png" alt="Database" width={40} height={40} className="h-10 w-auto mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Structured lead data</h3>
                <p className="text-gray-600 leading-relaxed">Get organized customer information ready for your CRM or sales team to follow up with qualified leads.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg flex items-start">
              <Image src="/chart.png" alt="Chart" width={40} height={40} className="h-10 w-auto mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">Improved conversion rates</h3>
                <p className="text-gray-600 leading-relaxed">Quick, intelligent responses lead to higher engagement and better conversion rates from Instagram inquiries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 text-gray-900">Ready to transform your Instagram DMs?</h2>
          <p className="text-base text-gray-600 mb-10 max-w-md mx-auto">Join businesses automating conversations with Velya</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push("/sign-up")} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md text-base font-normal transition-all hover:shadow-lg"
            >
              Start free trial
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/sign-in")}
              className="bg-white border-none text-gray-700 hover:text-blue-600 px-6 py-3 rounded-md text-base font-normal transition-colors"
            >
              Schedule demo →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
