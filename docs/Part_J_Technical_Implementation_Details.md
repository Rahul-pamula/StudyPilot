# PART J: TECHNICAL IMPLEMENTATION DETAILS (Algorithms & Fallbacks)

This section outlines the exact technical solutions to the most complex architectural challenges in StudyPilot V4.

## J.1 The PDF Text Extraction Pipeline (OCR & pdf.js Fallback)

Relying solely on `pdf-parse` will fail on older, scanned university exams. Furthermore, `unpdf` may have untested Edge constraints. StudyPilot utilizes a layered extraction pipeline to guarantee parsing.

```typescript
// utils/pdf-extractor.ts
import { getDocument } from 'pdfjs-dist'; // Standard browser/edge fallback
import { createWorker } from 'tesseract.js';

async function extractPDFText(buffer: Buffer): Promise<string> {
  try {
    // Try primary extraction
    const data = await tryExtractText(buffer);
    if (data.length > 500 && !hasGarbledText(data)) return data;
  } catch (e) {
    console.log('Text extraction failed, falling back to OCR');
  }
  
  // Fallback to OCR for scanned PDFs (runs locally or isolated microservice)
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(buffer);
  await worker.terminate();
  
  return text;
}
```

---

## J.2 Advanced Spaced Repetition Algorithm (Exponential Decay)

The basic SM-2 interval multiplier is modified to calculate the next review date based on a combination of retrieval response speed and physical rest metrics. Taking 60 seconds to answer a recall question means the student doesn't know it. We cap response time at 30 seconds and apply an exponential decay penalty.

```typescript
const timePenalty = Math.exp(-responseTimeMs / 15000); // 15-second half-life
// 5 seconds → 0.72 penalty (28% reduction)
// 15 seconds → 0.37 penalty (63% reduction)
// 30 seconds → 0.14 penalty (86% reduction)
```

---

## J.3 Offline Sync Queue

When students study offline (e.g., on a subway or in a library without Wi-Fi), attempts must be queued locally and synced later.

```typescript
// lib/offline-sync.ts
class OfflineSyncQueue {
  private queue: any[] = [];
  
  async saveAttempt(attempt: StudyAttempt) {
    this.queue.push(attempt);
    await this.persistToIndexedDB(attempt);
  }
  
  async sync() {
    if (!navigator.onLine) return;
    
    for (const attempt of this.queue) {
      await fetch('/api/study-sessions', {
        method: 'POST',
        body: JSON.stringify(attempt)
      });
    }
    this.queue = [];
  }
}

// Listen for online event
window.addEventListener('online', () => syncQueue.sync());
```

---

## J.4 Web Push Notifications (VAPID + Cron)

```typescript
// app/api/push/subscribe/route.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@studypilot.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Scheduled function (runs daily via Vercel Cron Jobs)
export async function sendDailyReminders() {
  const dueTopics = await db.exam_topics.findMany({
    where: { next_review_date: { lte: new Date() }, user: { push_enabled: true } }
  });
  
  for (const topic of dueTopics) {
    await webpush.sendNotification(
      topic.user.pushSubscription,
      JSON.stringify({
        title: 'Time to Review!',
        body: `Your spaced repetition for ${topic.topic_name} is due.`,
        icon: '/icon-192.png',
        data: { topicId: topic.id }
      })
    );
  }
}
```
