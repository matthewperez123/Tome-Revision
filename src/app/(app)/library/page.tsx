import { PublicLibraryPage } from "@/components/landing/PublicLibraryPage"

// Public marketing/preview surface. The authenticated catalog
// (filters, search, recommendations, etc.) lives at /library/browse.
// Rendered without the AppShell sidebar/topbar — see app-shell.tsx,
// where /library is included in the `isLanding` set.
export default function Page() {
  return <PublicLibraryPage />
}
