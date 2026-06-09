'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, KeyRound } from 'lucide-react'

function VerifyContent() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const supabase = createClient()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Email address is missing. Please try signing up again.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <Card className="w-full max-w-md bg-gray-900/90 border-gray-800 shadow-2xl relative z-10 animate-slide-in">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <KeyRound className="h-10 w-10 text-blue-500 animate-pulse-glow" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to <strong>{email || 'your email'}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              maxLength={6}
              className="bg-gray-800/50 border-gray-700 h-12 text-center text-2xl tracking-widest focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full h-12 text-md font-semibold bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" />
      <Suspense fallback={<div className="relative z-10">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
