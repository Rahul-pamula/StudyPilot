'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                {user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium">{user?.user_metadata?.full_name || 'Student'}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800">
            <Button variant="destructive" onClick={signOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
