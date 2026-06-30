"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TomeEconomyProvider } from "@/components/tome/economy-provider"
import { BookProgressProvider } from "@/components/tome/book-progress-provider"
import { AppSidebar } from "@/components/tome/app-sidebar"
import { TopBar } from "@/components/tome/top-bar"
import { PageTransition } from "@/components/tome/page-transition"
import { ErrorBoundary } from "@/components/tome/error-boundary"
import { VirgilWrapper } from "@/components/tome/virgil/VirgilWrapper"
import { MobileDock } from "@/components/tome/mobile-dock"
import { Toaster } from "@/components/ui/sonner"
import { IntercomMessenger } from "@/components/support/IntercomMessenger"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Public marketing surfaces. The bare /library route now 308-redirects to the
  // single functional catalog at /library/browse, which uses the full app chrome.
  const isLanding =
    pathname === "/" ||
    pathname === "/readers" ||
    pathname === "/educators" ||
    pathname === "/virgil" ||
    pathname === "/pricing" ||
    pathname === "/faq" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/contact" ||
    pathname === "/accessibility"

  // Landing page has its own navbar — hide app chrome. Marketing surfaces
  // also omit the floating Virgil companion (no VirgilWrapper here); the
  // companion only belongs to authenticated app surfaces below.
  if (isLanding) {
    return (
      <ErrorBoundary>
      <TomeEconomyProvider>
      <BookProgressProvider>
      <TooltipProvider>
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Toaster />
        <IntercomMessenger />
      </TooltipProvider>
      </BookProgressProvider>
      </TomeEconomyProvider>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
    <TomeEconomyProvider>
    <BookProgressProvider>
    <TooltipProvider>
    <VirgilWrapper>
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-svh w-full flex-col overflow-hidden">
          <TopBar />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom,0px))] min-[480px]:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
          <MobileDock />
          <Toaster />
          <IntercomMessenger />
        </div>
      </SidebarProvider>
    </VirgilWrapper>
    </TooltipProvider>
    </BookProgressProvider>
    </TomeEconomyProvider>
    </ErrorBoundary>
  )
}
