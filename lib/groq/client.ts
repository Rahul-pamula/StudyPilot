import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function callGroq(
  prompt: string,
  systemPrompt: string = 'You are a helpful exam analyzer and study assistant. Always return valid JSON when asked for structured data.'
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })

    return completion.choices[0]?.message?.content || '{}'
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error('Failed to call Groq API')
  }
}

export async function callGroqStream(
  prompt: string,
  systemPrompt: string = 'You are a helpful study assistant.'
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 4096,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error('Failed to call Groq API')
  }
}
