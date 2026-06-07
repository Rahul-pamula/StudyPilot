# PART J: TECHNICAL IMPLEMENTATION DETAILS (Algorithms & Edge Constraints)

This section outlines the exact technical solutions to the most complex architectural challenges in StudyPilot V4.

## J.1 Vercel Edge Runtime & Streaming Fallbacks

To bypass the 15-second serverless execution limits and 4.5MB payload limits on Vercel, all long-running orchestrations must be moved to asynchronous background jobs (or GCP/AWS VMs), while the Next.js Edge Runtime is reserved strictly for streaming the **Vercel AI SDK**. `LangChain JS` is explicitly banned from this codebase.

---

## J.2 Advanced Spaced Repetition Algorithm

The basic SM-2 interval multiplier is modified to calculate the next review date based on a combination of retrieval response speed, three-tier rubric scores, and physical rest metrics.

Let the next review interval ($I_{n+1}$, in days) be calculated as:
$$I_{n+1} = I_n \times EF \times \phi(R, S, T)$$

Where:
- $I_n$ is the current review interval (minimum 1 day).
- $EF$ is the Easiness Factor of the topic, calibrated between 1.3 and 2.5.
- $\phi(R, S, T)$ is the dynamic cognitive modulation function defined as:
  
  $$\phi(R, S, T) = \left( \frac{R}{100} \right) \times \left( \frac{S}{8.0} \right) \times \left( 1.0 - \min\left(0.3, \frac{T}{60000}\right) \right)$$

Where:
- $R$ is the final evaluation score (0 - 100) provided by the LLM grading ensemble.
- $S$ is the sleep duration (0 - 12 hours) from the previous night.
- $T$ is the response time in milliseconds. Slower response times ($T > 20,000$ ms) indicate retrieval difficulty.

**Result:** If a student achieves a high accuracy score ($R = 90$) but did so with extreme hesitation ($T = 45,000$ ms) under sleep deprivation ($S = 5.5$ hours), the interval multiplier $\phi$ automatically decreases below 1.0. This forces an early review of the concept.

---

## J.3 The Groq Prompt Engineering (Core Extractor)

The prompt that parses the exam is the most critical code in the application. It must extract `keywords` so that offline local models can generate questions without needing the cloud.

```typescript
export const EXAM_ANALYSIS_PROMPT = `
You are analyzing a university exam paper. Extract topics that appear in questions.

Rules:
1. A "topic" is a specific concept (e.g., "Newton's Second Law")
2. Count how many questions reference each topic
3. Estimate exam weight percentage based on points per question
4. Return ONLY valid JSON, no explanation

Output format:
{
  "topics": [
    {
      "name": "string",
      "questionCount": number,
      "estimatedWeight": number,
      "keywords": ["string"] // 3-5 keywords for future offline retrieval/grading
    }
  ]
}

Exam text:
{{EXAM_TEXT}}
`;
```
