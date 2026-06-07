# PART C: PROFILE & SETTINGS (LLD)

## C.1 Profile Page Architecture

### Navigation Structure (Mobile-First Bottom Tabs)

```text
Profile Page
├── 📱 Account
│   ├── Personal Information (Name, Email)
│   ├── Change Password
│   └── Delete Account (danger zone)
│
├── ⏱️ Timer Preferences
│   ├── Focus Duration (Default 25/50/90 min)
│   ├── Break Duration (Default 5/10/15 min)
│   ├── Auto-start Breaks (Toggle)
│   ├── Sound Alerts (Chime/Bell/None)
│   └── Volume Level
│
├── 🔔 Notifications
│   ├── Push Notifications (Browser Native)
│   └── Daily Reminders (Email)
│
├── 🛡️ Data & Storage
│   ├── Clear Local Storage (Wipes all local session history)
│   └── Export Options (Download JSON of study history)
│
├── 🎨 Appearance
│   ├── Theme (Dark/Light/System)
│   └── Accent Color (Custom)
│
└── ❓ Help & Support
    ├── FAQ
    └── About (Version 1.0.0 PWA)
```

## C.2 Profile UI Components

### Profile Header Component
```tsx
// ProfileHeader.tsx
const ProfileHeader = () => {
  const { user, profile } = useAuth();
  
  return (
    <div className="relative">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl" />
      
      <div className="absolute -bottom-12 left-6">
        <Avatar className="w-24 h-24 border-4 border-gray-900">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-2xl bg-gray-700">
            {profile.full_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="pt-16 px-6 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{profile.full_name}</h2>
          <div className="flex gap-1 mt-1">
            <Badge variant="secondary">🏆 {profile.study_streak} day streak</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Settings Subpage Example (Timer Preferences)
```tsx
// TimerSettings.tsx
const TimerSettings = () => {
  const { config, setConfig } = useTimerStore(); // Zustand state
  
  return (
    <div className="space-y-6 pb-20"> {/* pb-20 for mobile bottom nav safe area */}
      <h1 className="text-2xl font-bold">Timer Preferences</h1>
      
      <div className="space-y-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div>
          <Label>Default Focus Session (Minutes)</Label>
          <Slider 
            value={[config.focusDuration]} 
            onValueChange={(val) => setConfig({ focusDuration: val[0] })}
            max={120} min={15} step={5}
          />
          <div className="text-right text-sm text-gray-400 mt-1">{config.focusDuration} min</div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div>
            <Label>Auto-Start Breaks</Label>
            <p className="text-xs text-gray-400">Timer continues automatically</p>
          </div>
          <Switch 
            checked={config.autoStartBreaks} 
            onCheckedChange={(val) => setConfig({ autoStartBreaks: val })} 
          />
        </div>
      </div>
    </div>
  );
};
```
