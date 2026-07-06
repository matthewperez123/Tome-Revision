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
import { MobileDock } from "@/components/tome/mobile-dock"
import { Toaster } from "@/components/ui/sonner"
import { IntercomMessenger } from "@/components/support/IntercomMessenger"
import { AuthProvider } from "@/hooks/use-auth"
import { LandingNav } from "@/components/landing/LandingNav"

export function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Public marketing surfaces. /library is the Wanderer-hero marketing preview;
  // the functional catalog at /library/browse keeps the full app chrome.
  const isLanding =
    pathname === "/" ||
    pathname === "/readers" ||
    pathname === "/educators" ||
    pathname === "/virgil" ||
    pathname === "/pricing" ||
    pathname === "/faq" ||
    pathname === "/library" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/security" ||
    pathname === "/contact" ||
    pathname === "/accessibility"

  // Marketing surfaces hide the app chrome and omit the floating Virgil
  // companion (no VirgilWrapper here). The single marketing nav is mounted
  // HERE — once, by the shell — so it never unmounts/remounts as the visitor
  // navigates between marketing routes (this layout persists), and every route
  // shares the exact same deterministic nav. Individual marketing pages must
  // NOT render their own <LandingNav />.
  if (isLanding) {
    return (
      <AuthProvider>
      <ErrorBoundary>
      <TomeEconomyProvider>
      <BookProgressProvider>
      <TooltipProvider>
        <LandingNav />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Toaster />
        <IntercomMessenger />
      </TooltipProvider>
      </BookProgressProvider>
      </TomeEconomyProvider>
      </ErrorBoundary>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
    <ErrorBoundary>
    <TomeEconomyProvider>
    <BookProgressProvider>
    <TooltipProvider>
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
    </TooltipProvider>
    </BookProgressProvider>
    </TomeEconomyProvider>
    </ErrorBoundary>
    </AuthProvider>
  )
}
