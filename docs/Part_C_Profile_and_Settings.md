# PART C: PROFILE & SETTINGS (LLD)

## C.1 Device Synchronization Strategy

StudyPilot is designed to be used across multiple devices (e.g., studying on a laptop, checking streaks on a phone). Because we rely heavily on `IndexedDB` for granular session storage to reduce cloud costs, multi-device synchronization is a known architectural challenge.

### C.1.1 Conflict Resolution (V1 Limitation)
For Version 1.0, we are implementing a **"Last-Write-Wins with Timestamp"** strategy. 

*Known Limitation:* If a user studies offline on their laptop for 2 hours, and offline on their phone for 1 hour, and then both devices reconnect to the internet simultaneously, the device that syncs its `last_study_date` to Supabase last will overwrite the previous payload.

This limitation will be explicitly documented in the user's Profile Settings under "Sync Status."

## C.2 Profile UI Components

### Settings Subpage Example (Timer Preferences)
```tsx
// TimerSettings.tsx
const TimerSettings = () => {
  const { config, setConfig } = useTimerStore(); // Zustand state
  
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Timer Preferences</h1>
      
      <div className="space-y-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div>
          <Label>Default Focus Session (Minutes)</Label>
          <Slider 
            value={[config.focusDuration]} 
            onValueChange={(val) => setConfig({ focusDuration: val[0] })}
            max={120} min={15} step={5}
          />
        </div>
        
        <div className="pt-4 border-t border-gray-800">
          <Label>Cross-Device Sync</Label>
          <p className="text-xs text-gray-400">
            Last synced: {new Date().toLocaleTimeString()}
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Force Sync to Cloud
          </Button>
        </div>
      </div>
    </div>
  );
};
```
