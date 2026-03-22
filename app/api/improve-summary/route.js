import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    if (!token) return NextResponse.json({ summary: null }, { status: 401 })

    const supabase = createAdminClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ summary: null }, { status: 401 })

    const { previousScore, newScore, previousMissing, newMissing, addedKeywords } =
      await request.json()

    const delta = newScore - previousScore
    const topMissing = (newMissing ?? []).slice(0, 3).join(', ')
    const added = (addedKeywords ?? []).slice(0, 4).join(', ')

    const prompt =
      `You are a career coach giving a concise 1-2 sentence improvement summary.\n` +
      `ATS score changed from ${previousScore} to ${newScore} (${delta >= 0 ? '+' : ''}${delta} points).\n` +
      `Keywords newly added to resume: ${added || 'none'}.\n` +
      `Keywords still missing: ${topMissing || 'none'}.\n\n` +
      `Rules:\n` +
      `- Exactly 1-2 sentences maximum\n` +
      `- Be specific: reference actual keyword names from above\n` +
      `- If score improved: say what helped (name the keywords)\n` +
      `- If keywords still missing: name the top 1-2 to focus on next\n` +
      `- Encouraging but honest tone — not generic\n` +
      `- Plain text only, no markdown, no bullet points\n` +
      `- Return ONLY the summary text, nothing else`

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 300 },
      }),
    })

    if (!geminiRes.ok) return NextResponse.json({ summary: null })

    const data    = await geminiRes.json()
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null

    return NextResponse.json({ summary })
  } catch {
    return NextResponse.json({ summary: null })
  }
}
