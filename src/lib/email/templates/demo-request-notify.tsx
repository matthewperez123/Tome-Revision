import * as React from "react"
import {
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailParagraph,
  EmailSmall,
} from "./_shared"

export interface DemoRequestNotifyEmailProps {
  /** Internal inbox the notification is delivered to (footer attribution). */
  recipient: string
  name: string
  email: string
  organization?: string | null
  role?: string | null
  planInterest?: string | null
  studentCount?: number | null
  teacherCount?: number | null
  message?: string | null
  submittedAt: string
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <EmailParagraph>
      <strong>{label}:</strong> {value}
    </EmailParagraph>
  )
}

/** Internal sales alert sent to the Tome inbox when a demo lead comes in. */
export function DemoRequestNotifyEmail({
  recipient,
  name,
  email,
  organization,
  role,
  planInterest,
  studentCount,
  teacherCount,
  message,
  submittedAt,
}: DemoRequestNotifyEmailProps) {
  return (
    <EmailLayout
      preview={`New demo request from ${name}${organization ? ` (${organization})` : ""}`}
      recipient={recipient}
    >
      <EmailHeading>New demo request</EmailHeading>
      <EmailParagraph muted>
        A new lead came in through the /demo form. Reply directly to {email} to
        follow up.
      </EmailParagraph>

      <EmailDivider />

      <Field label="Name" value={name} />
      <Field label="Email" value={email} />
      {organization ? <Field label="Organization" value={organization} /> : null}
      {role ? <Field label="Role" value={role} /> : null}
      {planInterest ? <Field label="Plan interest" value={planInterest} /> : null}
      {studentCount != null ? (
        <Field label="Students" value={String(studentCount)} />
      ) : null}
      {teacherCount != null ? (
        <Field label="Teachers" value={String(teacherCount)} />
      ) : null}
      {message ? <Field label="Message" value={message} /> : null}

      <EmailDivider />

      <EmailSmall>Submitted {submittedAt}</EmailSmall>
    </EmailLayout>
  )
}

export default DemoRequestNotifyEmail
