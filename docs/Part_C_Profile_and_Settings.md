# PART C: PROFILE & SETTINGS (LLD)

## C.1 Profile Page Architecture

### Navigation Structure (Like Instagram)

```
Profile Page
├── 📱 Account
│   ├── Personal Information
│   │   ├── Full Name
│   │   ├── Email Address (verified badge)
│   │   ├── Avatar (upload/camera)
│   │   └── Bio
│   ├── Change Password
│   └── Delete Account (danger zone)
│
├── 🎯 Study Preferences
│   ├── Daily Goal (30-480 mins)
│   ├── Focus Sessions
│   └── Subjects (custom tags)
│
├── 🔔 Notifications
│   ├── Email Notifications
│   ├── Desktop Notifications
│   └── Quiet Hours (Do Not Disturb)
│
├── 🛡️ Privacy & Data
│   ├── GDPR Controls
│   ├── Tracking Controls
│   └── Export Options
│
├── 🎨 Appearance
│   ├── Theme (Dark/Light/System)
│   ├── Accent Color (Custom)
│   ├── Font Size (Small/Medium/Large)
│   └── Compact Mode
│
└── ❓ Help & Support
    ├── FAQ
    ├── Contact Support (live chat)
    ├── Feature Requests
    └── About (Version 1.0.0)
```

## C.2 Profile UI Components

### Profile Header Component
```tsx
// ProfileHeader.tsx
const ProfileHeader = () => {
  const { user, profile } = useAuth();
  
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl" />
      
      {/* Avatar - Large, editable */}
      <div className="absolute -bottom-12 left-6">
        <Avatar className="w-24 h-24 border-4 border-gray-900">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-2xl bg-gray-700">
            {profile.full_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <button className="absolute bottom-0 right-0 p-1 bg-gray-800 rounded-full">
          <Camera className="w-4 h-4" />
        </button>
      </div>
      
      {/* Stats Row */}
      <div className="pt-16 px-6 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{profile.full_name}</h2>
          <p className="text-gray-400 text-sm">{profile.email}</p>
          <div className="flex gap-1 mt-1">
            <Badge variant="secondary">🏆 {profile.study_streak} day streak</Badge>
            <Badge variant="secondary">🎯 {profile.total_hours}h studied</Badge>
          </div>
        </div>
        
        <Button variant="outline" onClick={() => openEditModal()}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
```

### Settings Subpage Example (Change Email)
```tsx
// ChangeEmail.tsx - Full page with verification
const ChangeEmailPage = () => {
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  
  const handleSendCode = async () => {
    await api.post('/auth/change-email-request', { email: newEmail });
    setStep('verify');
  };
  
  const handleVerify = async () => {
    await api.post('/auth/change-email-confirm', { 
      email: newEmail, 
      code: verificationCode 
    });
    toast.success('Email changed successfully!');
    navigate('/profile');
  };
  
  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
      <h1 className="text-2xl font-bold">Change Email Address</h1>
      
      <div className="space-y-4">
        <div>
          <Label>Current Email</Label>
          <Input value="old@email.com" disabled className="bg-gray-800" />
        </div>
        
        {step === 'input' ? (
          <>
            <div>
              <Label>New Email Address</Label>
              <Input 
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
              />
            </div>
            <Button onClick={handleSendCode} className="w-full">
              Send Verification Code
            </Button>
          </>
        ) : (
          <>
            <div>
              <Label>Verification Code</Label>
              <Input 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <p className="text-xs text-gray-400 mt-1">
                Code sent to {newEmail}
              </p>
            </div>
            <Button onClick={handleVerify} className="w-full">
              Confirm New Email
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
```
