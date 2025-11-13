# Trial Mode - Quick Reference Card

## 🎯 Limits

| Type      | Limit  | Key                |
| --------- | ------ | ------------------ |
| Notes     | 5      | `trial-notes`      |
| Chats     | 10     | `trial-chat-count` |
| Retention | 7 days | -                  |

## 📦 Constants

```typescript
// Import from utils
import {
  TRIAL_NOTE_LIMIT, // 5
  TRIAL_CHAT_LIMIT, // 10
  getTrialChatCount,
  incrementTrialChatCount,
  hasReachedChatLimit,
} from "@/app/(frontend)/core/utils/trialMode";
```

## 🔗 Store Usage

```typescript
// Import store
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";

// In component
const {
  // Notes
  notes,
  noteCount,
  remainingNotes,
  hasReachedLimit,

  // Chats
  chatCount,
  remainingChats,
  hasReachedChatLimit,
  incrementChat,
} = useTrialModeStore();
```

## 🌐 API Endpoints

### Trial Notes Sync

```typescript
// Create/Update note
POST / api / trial / sync - pinecone;
Body: {
  note: TrialNote;
}

// Delete note
DELETE / api / trial / sync - pinecone / [id];
```

### Cleanup Job

```typescript
// Run cleanup (protected)
POST /api/cron/cleanup-trial-notes
Header: Authorization: Bearer ${CRON_SECRET}

// Dry run (protected)
GET /api/cron/cleanup-trial-notes
Header: Authorization: Bearer ${CRON_SECRET}
```

## 🎨 UI Components

### TrialModeBanner

```tsx
<TrialModeBanner
  dict={{
    trialMode: "Trial Mode",
    notesRemaining: "notes remaining",
    chatsRemaining: "chats remaining",
    signUpForUnlimited: "Sign up for unlimited!",
    signUp: "Sign Up",
  }}
/>
```

Shows:

- 📝 5/5 notes remaining
- 💬 3/10 chats remaining

### AIChatBox

Automatically:

- ✅ Tracks chat count
- ✅ Disables when limit reached
- ✅ Shows upgrade message
- ✅ Displays remaining chats

## ⚡ Quick Commands

### Test Locally

```bash
# Set chat count to test limit
# In browser console:
localStorage.setItem('trial-chat-count', '9');

# Test cleanup (dry run)
curl -X GET http://localhost:3000/api/cron/cleanup-trial-notes \
  -H "Authorization: Bearer test-secret"
```

### Deploy

```bash
# 1. Set environment variable in Vercel
CRON_SECRET=your-secret-here

# 2. Deploy
git push origin main

# 3. Verify cron
# Check Vercel dashboard → Cron jobs
```

### Monitor

```bash
# Check Vercel logs
vercel logs

# Manual trigger cleanup
curl -X POST https://your-app.vercel.app/api/cron/cleanup-trial-notes \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

## 📚 Documentation

- [TRIAL_PINECONE_ARCHITECTURE_VI.md](./TRIAL_PINECONE_ARCHITECTURE_VI.md) - Full architecture (Vietnamese)
- [CLEANUP_JOB.md](./CLEANUP_JOB.md) - Cleanup job details
- [TRIAL_MODE_UPDATES.md](./TRIAL_MODE_UPDATES.md) - Recent changes summary

## 💡 Common Tasks

### Reset Trial Data

```typescript
// In browser console
localStorage.removeItem("trial-notes");
localStorage.removeItem("trial-chat-count");
location.reload();
```

### Check Current Limits

```typescript
// In browser console
const notes = JSON.parse(localStorage.getItem("trial-notes") || "[]");
const chatCount = localStorage.getItem("trial-chat-count") || "0";
console.log(`Notes: ${notes.length}/5`);
console.log(`Chats: ${chatCount}/10`);
```

### Force Limit State (Testing)

```typescript
// Max out notes
const maxNotes = Array(5)
  .fill(null)
  .map((_, i) => ({
    id: `trial-${Date.now()}-${i}`,
    title: `Note ${i + 1}`,
    content: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
localStorage.setItem("trial-notes", JSON.stringify(maxNotes));

// Max out chats
localStorage.setItem("trial-chat-count", "10");

location.reload();
```

## 🔍 Troubleshooting

### Chat not incrementing?

```typescript
// Check in browser console
console.log("Chat count:", localStorage.getItem("trial-chat-count"));

// Manually increment
const current = parseInt(localStorage.getItem("trial-chat-count") || "0");
localStorage.setItem("trial-chat-count", String(current + 1));
```

### Cleanup not running?

1. Check `vercel.json` exists
2. Verify `CRON_SECRET` in Vercel dashboard
3. Check Vercel logs for cron execution
4. Test endpoint manually

### Banner not showing limits?

```typescript
// Force refresh stats
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";

useTrialModeStore.getState().refreshStats();
useTrialModeStore.getState().refreshChatStats();
```

## 🎯 Best Practices

1. **Always check limits before actions**

   ```typescript
   if (hasReachedChatLimit) {
     // Show upgrade dialog
     return;
   }
   incrementChat();
   // Proceed with chat
   ```

2. **Refresh stats on mount**

   ```typescript
   useEffect(() => {
     loadNotes();
     refreshChatStats();
   }, []);
   ```

3. **Handle edge cases**

   ```typescript
   const newCount = incrementChat();
   if (newCount === null) {
     // Limit reached mid-operation
     toast.error("Chat limit reached!");
     return;
   }
   ```

4. **Clear on sign up**
   ```typescript
   // After successful sign up
   clearTrialNotes();
   clearTrialChatCount();
   ```
