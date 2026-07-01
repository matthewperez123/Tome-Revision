import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hasActiveSchoolEntitlement } from "@/lib/entitlements/server"

export async function POST(request: Request) {
  // Verify the user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify the user is a teacher
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can generate quizzes" }, { status: 403 })
  }

  // AI quiz generation is a paid educator tool — gate behind School.
  if (!(await hasActiveSchoolEntitlement(user.id))) {
    return NextResponse.json(
      { error: "AI quiz generation requires an active School plan." },
      { status: 403 },
    )
  }

  const body = await request.json()
  const { bookId, difficulty = "scholar", count = 5 } = body

  if (!bookId) {
    return NextResponse.json({ error: "bookId is required" }, { status: 400 })
  }

  // Fetch book info
  const { data: book } = await supabase
    .from("books")
    .select("title, author")
    .eq("id", bookId)
    .single()

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Fallback: return sample questions if no API key configured
    return NextResponse.json({
      questions: generateFallbackQuestions(book.title, book.author, count),
    })
  }

  try {
    const prompt = `You are a literature teacher creating a quiz for students on "${book.title}" by ${book.author}.

Generate exactly ${count} questions at ${difficulty} difficulty level. Mix the following types:
- Multiple choice (most common)
- True/false
- Vocabulary in context

Return ONLY a JSON array (no other text) with this schema:
[
  {
    "type": "multiple_choice" | "true_false" | "vocabulary",
    "question": "question text",
    "options": ["A", "B", "C", "D"] (only for multiple_choice),
    "correctAnswer": "the correct answer text",
    "explanation": "brief explanation of why this is correct"
  }
]`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const message = await response.json()
    const text = message.content?.[0]?.text
    if (!text) throw new Error("No text in response")

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error("Could not parse questions")

    const questions = JSON.parse(jsonMatch[0])
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json({
      questions: generateFallbackQuestions(book.title, book.author, count),
    })
  }
}

function generateFallbackQuestions(title: string, author: string, count: number) {
  const templates = [
    {
      type: "multiple_choice",
      question: `What is the primary narrative voice used in "${title}"?`,
      options: ["First person", "Second person", "Third person limited", "Third person omniscient"],
      correctAnswer: "Third person omniscient",
      explanation: "Consider how the narrator accesses different characters' thoughts and perspectives.",
    },
    {
      type: "true_false",
      question: `"${title}" was originally written in English.`,
      correctAnswer: "True",
      explanation: `Check the original language of publication for "${title}" by ${author}.`,
    },
    {
      type: "multiple_choice",
      question: `Which literary period is "${title}" most closely associated with?`,
      options: ["Romanticism", "Realism", "Modernism", "Classicism"],
      correctAnswer: "Realism",
      explanation: "Consider the time period and literary movement the author was part of.",
    },
    {
      type: "vocabulary",
      question: `In the context of "${title}", what best describes the tone of the opening chapter?`,
      options: ["Melancholic", "Satirical", "Reverent", "Bucolic"],
      correctAnswer: "Satirical",
      explanation: "Pay attention to the author's use of irony and social commentary.",
    },
    {
      type: "multiple_choice",
      question: `What is a central theme explored in "${title}"?`,
      options: ["The corrupting influence of power", "The nature of justice", "The search for identity", "All of the above"],
      correctAnswer: "All of the above",
      explanation: `${author} weaves multiple thematic threads throughout the work.`,
    },
  ]

  return templates.slice(0, count)
}
