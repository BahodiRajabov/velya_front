import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">AutoSMS</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/messages"
              className={cn(
                "transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Messages
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 