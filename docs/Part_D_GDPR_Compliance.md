# PART D: GDPR COMPLIANCE

## D.1 GDPR Implementation Checklist

### User Rights Endpoints
```python
# FastAPI routes for GDPR
@router.get("/user/data/export")
async def export_user_data(current_user: User = Depends(get_current_user)):
    """Generate GDPR-compliant data export (JSON)"""
    data = {
        "profile": current_user.profile.dict(),
        "study_sessions": get_user_sessions(current_user.id),
        "focus_scores": get_focus_history(current_user.id),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Generate file and upload to S3 with 24h expiry
    s3_key = f"exports/{current_user.id}/gdpr_export_{date.today()}.json"
    s3_client.put_object(Bucket='studypilot-exports', Key=s3_key, Body=json.dumps(data))
    
    return {"download_url": generate_presigned_url(s3_key, expires=86400)}

@router.delete("/user/data")
async def delete_all_user_data(current_user: User = Depends(get_current_user)):
    """Right to be forgotten"""
    # Delete from PostgreSQL
    db.query(Session).filter_by(user_id=current_user.id).delete()
    db.query(FocusScore).filter_by(user_id=current_user.id).delete()
    db.query(Profile).filter_by(id=current_user.id).delete()
    
    # Queue deletion of local daemon data via WebSocket
    await notify_daemon(current_user.id, "delete_local_data")
    
    # Delete auth user
    supabase.auth.admin.delete_user(current_user.id)
    
    db.commit()
    return {"message": "All data permanently deleted"}
```

### Cookie Consent Banner
```tsx
// GDPRConsent.tsx - Shown on first launch
const GDPRConsent = () => {
  const [accepted, setAccepted] = useState(false);
  
  if (localStorage.getItem('gdpr_accepted')) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="text-sm space-y-1">
          <p>🍪 We value your privacy. StudyPilot uses:</p>
          <ul className="list-disc list-inside text-gray-300">
            <li>Essential cookies for authentication</li>
            <li>Local storage for preferences</li>
            <li>No third-party tracking</li>
          </ul>
          <Link to="/privacy" className="text-blue-400 underline">Read Privacy Policy</Link>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setAccepted(false)}>
            Reject Non-Essential
          </Button>
          <Button onClick={() => {
            localStorage.setItem('gdpr_accepted', 'true');
            setAccepted(true);
          }}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};
```
