'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { UploadCloud, File, X, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { extractTextFromBuffer } from '@/lib/utils/pdf-extractor'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [examName, setExamName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progressStatus, setProgressStatus] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setExamName(acceptedFiles[0].name.replace('.pdf', ''))
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const handleProcess = async () => {
    if (!file || !examName) return

    try {
      setProcessing(true)
      setError('')
      
      setProgressStatus('Extracting text from PDF...')
      const arrayBuffer = await file.arrayBuffer()
      const text = await extractTextFromBuffer(arrayBuffer)
      
      if (!text || text.trim().length < 50) {
        throw new Error("Could not extract enough text from this PDF. Please ensure it is text-searchable, not an image scan.")
      }

      setProgressStatus('AI is analyzing topics & building flashcards (this takes ~30s)...')
      
      const response = await fetch('/api/exams/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: file.name,
          examName: examName,
          text: text
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process exam')
      }

      const { examId } = await response.json()
      
      setProgressStatus('Complete! Redirecting...')
      router.push(`/dashboard/exams/${examId}`)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Exam</h2>
        <p className="text-muted-foreground mt-1">Upload a past paper or syllabus to generate your 80/20 plan.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6 space-y-6">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-200">Drag & drop your PDF here</h3>
              <p className="text-sm text-gray-400 mt-2">Maximum file size: 10MB</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-200">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={processing}>
                  <X className="h-5 w-5 text-gray-400 hover:text-red-400" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Exam Name</label>
                <Input 
                  value={examName} 
                  onChange={(e) => setExamName(e.target.value)}
                  disabled={processing}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g. CS101 Final 2023"
                />
              </div>

              {error && <div className="p-3 bg-red-950/50 border border-red-900 rounded text-sm text-red-400">{error}</div>}

              <Button 
                onClick={handleProcess} 
                disabled={processing || !examName} 
                className="w-full h-12 text-md font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {progressStatus}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Extract 80/20 Plan & Generate Flashcards
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
