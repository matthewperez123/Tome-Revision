/**
 * Weekly review digest — RUBRIC styling.
 *
 * Fraunces for display headings, Literata for body (serif fallbacks for email
 * clients that lack the webfonts), the RUBRIC accent palette. Iridescence is
 * reserved exclusively for Virgil's note — the rest of the email stays in flat
 * ink + accent colour.
 */

import * as React from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

// RUBRIC palette
const C = {
  paper: "#F6F1E7",
  card: "#FFFFFF",
  border: "#E4DCCB",
  ink: "#1C1A17",
  muted: "#6B6253",
  lapis: "#2A4B8D",
  vermilion: "#C13B2B",
  gold: "#C8A24B",
  tyrian: "#66023C",
  verdigris: "#3E8E84",
} as const

const display =
  "Fraunces, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
const serif =
  "Literata, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"

export interface DigestBook {
  title: string
  href: string
}

export interface WeeklyDigestProps {
  recipient: string
  displayName: string
  /** Monday→Sunday window label, e.g. "Jun 23 – Jun 29". */
  weekLabel: string
  chaptersRead: number
  trialsPassed: number
  /** Average Trial score this week, 0..100. */
  averageScore: number
  wisdomEarned: number
  flameCount: number
  /** 1–2 books to pick back up. */
  continueBooks: DigestBook[]
  /** Optional warm one-liner in Virgil's voice. Iridescent treatment. */
  virgilNote?: string
  /** Absolute URL back into the Stoa. */
  stoaUrl: string
}

function Stat({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: string
}) {
  return (
    <Column style={{ textAlign: "center", padding: "0 6px" }}>
      <Text
        style={{
          margin: 0,
          fontFamily: display,
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1.1,
          color,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          margin: "4px 0 0",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.muted,
        }}
      >
        {label}
      </Text>
    </Column>
  )
}

export function WeeklyDigestEmail({
  recipient,
  displayName,
  weekLabel,
  chaptersRead,
  trialsPassed,
  averageScore,
  wisdomEarned,
  flameCount,
  continueBooks,
  virgilNote,
  stoaUrl,
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
      </Head>
      <Preview>
        {`Your week in Tome — ${chaptersRead} chapters, ${trialsPassed} Trials, ${wisdomEarned} Wisdom.`}
      </Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: C.paper,
          fontFamily: serif,
          color: C.ink,
        }}
      >
        <Container style={{ maxWidth: 580, margin: "0 auto", padding: "32px 16px 48px" }}>
          {/* Masthead */}
          <Section style={{ textAlign: "center", padding: "8px 0 20px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: display,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              Tome
            </Text>
            <div
              style={{
                width: 32,
                height: 2,
                backgroundColor: C.gold,
                margin: "8px auto 0",
                borderRadius: 1,
              }}
            />
          </Section>

          {/* Card */}
          <Section
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "36px 32px",
            }}
          >
            <Text
              style={{
                margin: "0 0 4px",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.lapis,
              }}
            >
              Your week · {weekLabel}
            </Text>
            <Text
              style={{
                margin: "0 0 18px",
                fontFamily: display,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.25,
                color: C.ink,
              }}
            >
              {displayName}, here&rsquo;s what you read.
            </Text>

            {/* Stat strip */}
            <Section
              style={{
                backgroundColor: C.paper,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "20px 8px",
              }}
            >
              <Row>
                <Stat value={String(chaptersRead)} label="Chapters" color={C.lapis} />
                <Stat value={String(trialsPassed)} label="Trials" color={C.verdigris} />
                <Stat value={`${averageScore}%`} label="Avg score" color={C.tyrian} />
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Stat value={String(wisdomEarned)} label="Wisdom" color={C.gold} />
                <Stat value={`${flameCount}🔥`} label="Flames" color={C.vermilion} />
              </Row>
            </Section>

            {/* Virgil note — the ONLY iridescent element */}
            {virgilNote ? (
              <Section
                style={{
                  margin: "24px 0 0",
                  padding: "16px 18px",
                  borderRadius: 12,
                  borderLeft: `3px solid ${C.lapis}`,
                  background:
                    "linear-gradient(120deg, rgba(42,75,141,0.10), rgba(62,142,132,0.10) 45%, rgba(200,162,75,0.12) 100%)",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 6px",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.lapis,
                  }}
                >
                  A word from Virgil
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: serif,
                    fontSize: 15,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    color: C.ink,
                  }}
                >
                  {virgilNote}
                </Text>
              </Section>
            ) : null}

            {/* Continue reading */}
            {continueBooks.length > 0 ? (
              <>
                <Hr
                  style={{
                    border: "none",
                    borderTop: `1px solid ${C.border}`,
                    margin: "26px 0 18px",
                  }}
                />
                <Text
                  style={{
                    margin: "0 0 10px",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: C.muted,
                  }}
                >
                  Pick back up
                </Text>
                {continueBooks.map((b) => (
                  <Text key={b.href} style={{ margin: "0 0 8px" }}>
                    <Link
                      href={b.href}
                      style={{
                        fontFamily: serif,
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.lapis,
                        textDecoration: "none",
                      }}
                    >
                      → {b.title}
                    </Link>
                  </Text>
                ))}
              </>
            ) : null}

            {/* CTA */}
            <Section style={{ textAlign: "center", padding: "26px 0 4px" }}>
              <Link
                href={stoaUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: C.lapis,
                  color: "#FFFFFF",
                  fontFamily: serif,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "12px 26px",
                  borderRadius: 10,
                }}
              >
                Return to the Stoa
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", padding: "24px 16px 0" }}>
            <Text style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: C.muted }}>
              Tome · The classics, made readable.
            </Text>
            <Text style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.6, color: C.muted }}>
              Sent to {recipient}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WeeklyDigestEmail
