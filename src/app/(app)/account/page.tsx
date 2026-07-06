import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft, ShieldAlert } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DeleteAccountDialog } from "@/components/auth/delete-account-dialog"
import { NotificationPreferencesForm } from "@/components/account/notification-preferences-form"
import { ManageBillingButton } from "@/components/account/manage-billing-button"
import { getNotificationPreferences } from "@/lib/actions/notification-preferences"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?error=session_missing")
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const fullName =
    typeof meta.full_name === "string" ? (meta.full_name as string) : null

  const notificationPrefs = await getNotificationPreferences()

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("stripe_customer_id, role")
    .eq("id", user.id)
    .maybeSingle()
  const hasBilling = Boolean(profileRow?.stripe_customer_id)
  // Students sign in with a class code and have no email on any surface. Their
  // account is teacher-managed, so we hide every email / password-recovery /
  // self-delete control from them (COPPA).
  const isStudent = profileRow?.role === "student"

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Header */}
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Back to profile
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight mt-3">
            Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your sign-in details and danger-zone actions.
          </p>
        </div>

        {/* Account info */}
        <section>
          <h2 className="font-serif text-xl font-semibold tracking-tight mb-4">
            Sign-in details
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <div className="px-5 py-4">
              <p className="text-[11px] text-muted-foreground">Name</p>
              <p className="text-sm font-medium mt-0.5">
                {fullName || "—"}
              </p>
            </div>
            {isStudent ? (
              <div className="px-5 py-4">
                <p className="text-[11px] text-muted-foreground">How you sign in</p>
                <p className="text-sm font-medium mt-0.5">
                  You sign in with your class code.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask your teacher if you need your code.
                </p>
              </div>
            ) : (
              <>
                <div className="px-5 py-4">
                  <p className="text-[11px] text-muted-foreground">Email</p>
                  <p className="text-sm font-medium mt-0.5">{user.email}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[11px] text-muted-foreground">Password</p>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-0.5 inline-block"
                  >
                    Send password reset email
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Email notifications — students have no email, so this is hidden. */}
        {!isStudent && (
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-4">
              Email notifications
            </h2>
            <NotificationPreferencesForm initial={notificationPrefs} />
          </section>
        )}

        {/* Billing */}
        {hasBilling && (
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-4">
              Billing
            </h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-medium">Subscription &amp; payment</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Update your payment method, switch plans, or cancel in the Stripe
                billing portal. Changes take effect right away.
              </p>
              <div className="mt-4">
                <ManageBillingButton />
              </div>
            </div>
          </section>
        )}

        {/* Danger zone — a student's account is teacher-managed; no self-delete. */}
        {!isStudent && (
        <section>
          <h2 className="font-serif text-xl font-semibold tracking-tight text-rose-600 flex items-center gap-2 mb-4">
            <ShieldAlert className="size-5" />
            Danger zone
          </h2>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
            <p className="text-sm font-medium">Delete your account</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This permanently deletes your account, your library, your
              annotations, and every trace of your activity on Tome. This
              cannot be undone.
            </p>
            <div className="mt-4">
              <DeleteAccountDialog />
            </div>
          </div>
        </section>
        )}
      </div>
    </div>
  )
}
