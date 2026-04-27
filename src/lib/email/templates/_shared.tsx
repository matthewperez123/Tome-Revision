/**
 * Shared layout primitives for transactional email templates.
 *
 * Visual language matches the in-app Tome aesthetic: clean white card,
 * indigo accents, serif headings, neutral body text. Optimised for both
 * light and dark email clients.
 */

import * as React from "react"
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

const COLORS = {
  bg: "#F7F6F3",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  indigo: "#6366F1",
} as const

export const EMAIL_COLORS = COLORS

const fontStack =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const serifStack =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"

export interface EmailLayoutProps {
  preview: string
  /** Recipient address for the footer attribution. */
  recipient: string
  children: React.ReactNode
}

export function EmailLayout({ preview, recipient, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: COLORS.bg,
          fontFamily: fontStack,
          color: COLORS.text,
        }}
      >
        <Container
          style={{
            maxWidth: 580,
            margin: "0 auto",
            padding: "32px 16px 48px",
          }}
        >
          {/* Masthead */}
          <Section style={{ textAlign: "center", padding: "8px 0 24px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: serifStack,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: COLORS.text,
              }}
            >
              Tome
            </Text>
            <div
              style={{
                width: 32,
                height: 2,
                backgroundColor: COLORS.indigo,
                margin: "8px auto 0",
                borderRadius: 1,
              }}
            />
          </Section>

          {/* Card */}
          <Section
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "40px 32px",
            }}
          >
            {children}
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", padding: "24px 16px 0" }}>
            <Text
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.6,
                color: COLORS.muted,
              }}
            >
              Tome · The classics, made readable.
            </Text>
            <Text
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                lineHeight: 1.6,
                color: COLORS.muted,
              }}
            >
              Sent to {recipient}
            </Text>
            <Text
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                lineHeight: 1.6,
                color: COLORS.muted,
              }}
            >
              {/* TODO: replace with real registered business address before launch */}
              Tome, Delaware, USA
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontFamily: serifStack,
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 1.3,
        color: COLORS.text,
      }}
    >
      {children}
    </Text>
  )
}

export function EmailParagraph({
  children,
  muted,
}: {
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontSize: 15,
        lineHeight: 1.7,
        color: muted ? COLORS.muted : COLORS.text,
      }}
    >
      {children}
    </Text>
  )
}

export function EmailButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Section style={{ textAlign: "center", padding: "8px 0 8px" }}>
      <Link
        href={href}
        style={{
          display: "inline-block",
          backgroundColor: COLORS.indigo,
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          padding: "12px 24px",
          borderRadius: 8,
        }}
      >
        {children}
      </Link>
    </Section>
  )
}

export function EmailDivider() {
  return (
    <Hr
      style={{
        border: "none",
        borderTop: `1px solid ${COLORS.border}`,
        margin: "24px 0",
      }}
    />
  )
}

export function EmailSmall({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        margin: 0,
        fontSize: 13,
        lineHeight: 1.6,
        color: COLORS.muted,
      }}
    >
      {children}
    </Text>
  )
}
