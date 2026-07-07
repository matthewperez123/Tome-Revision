import { redirect } from "next/navigation"

/**
 * Messages was removed from the sidebar IA. The direct-messaging feature code
 * (hooks in use-conversations / use-conversation, actions in
 * @/lib/actions/messages, and the former page UI in git history) is left
 * dormant; this route now redirects to the dashboard so any lingering link
 * resolves cleanly. Restore the previous page.tsx to re-enable the surface.
 */
export default function MessagesPage() {
  redirect("/dashboard")
}
