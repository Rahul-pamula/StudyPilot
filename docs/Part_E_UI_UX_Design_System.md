# PART E: UI/UX DESIGN SYSTEM (The Academic OS)

## E.1 Core Interfaces

The user interface pivots entirely away from "stopwatches" and towards "Active Interaction."

### 1. The 80/20 Exam Analyzer View
```tsx
// ExamAnalyzer.tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left: Upload Zone */}
  <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
    <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
    <h3>Upload Past Papers</h3>
    <p className="text-gray-400">PDF, DOCX. Max 5 files.</p>
  </div>
  
  {/* Right: The AI Result */}
  <div className="bg-gray-900 rounded-xl p-6">
    <h3 className="font-bold text-xl text-yellow-500 flex items-center gap-2">
      <Zap /> The 80/20 High-Yield Plan
    </h3>
    <ul className="mt-4 space-y-4">
      {topics.map(topic => (
        <li className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span>{topic.name}</span>
          <Badge variant="destructive">{topic.weight}% of Exam</Badge>
        </li>
      ))}
    </ul>
  </div>
</div>
```

### 2. The Active Recall Gate
This is the most critical UI component. It replaces the "End Session" button.

```tsx
// ActiveRecallGate.tsx
<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
  <div className="bg-gray-900 max-w-2xl w-full rounded-2xl p-8">
    <h2 className="text-2xl font-bold mb-2">Wait! Don't close the book yet.</h2>
    <p className="text-gray-400 mb-6">To log this session, prove what you learned about <b>{currentTopic}</b>.</p>
    
    <div className="space-y-6">
      <div>
        <p className="font-medium text-blue-400 mb-2">Q: {groqGeneratedQuestion}</p>
        <Textarea 
          placeholder="Explain it like I'm 5..."
          className="min-h-[150px] text-lg"
        />
      </div>
      
      <Button size="lg" className="w-full">
        Submit for AI Grading
      </Button>
    </div>
  </div>
</div>
```

## E.2 Typography & Psychology
- We replace stress-inducing red colors with calm, authoritative blues and academic purples.
- We remove all countdown visual stress (no ticking numbers). Focus is entirely on the *content* of the screen, not the clock.
