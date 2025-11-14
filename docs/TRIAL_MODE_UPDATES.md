# Trial Mode Updates - Summary

## Ngày: 13 Tháng 11, 2024

## 🎯 Các Tính Năng Mới

### 1. Giới Hạn Chat cho Trial Mode (10 requests)

#### Backend Changes

- **File:** `src/app/(frontend)/core/utils/trialMode.ts`
  - Thêm `TRIAL_CHAT_LIMIT = 10`
  - Thêm `TRIAL_CHAT_COUNT_KEY` localStorage key
  - Thêm functions: `getTrialChatCount()`, `incrementTrialChatCount()`, `hasReachedChatLimit()`, `getRemainingChatCount()`, `clearTrialChatCount()`

#### Store Updates

- **File:** `src/app/(frontend)/core/store/useTrialModeStore.ts`
  - Thêm chat state: `chatCount`, `remainingChats`, `hasReachedChatLimit`
  - Thêm actions: `incrementChat()`, `refreshChatStats()`
  - Update `setTrialMode()` để load chat stats

#### UI Components

- **File:** `src/app/(frontend)/(modules)/notes/components/organisms/ChatBot/ChatBot.tsx`

  - Wrap `handleSubmit` để check và increment chat count
  - Disable input khi đạt limit
  - Hiển thị remaining chats count
  - Hiển thị upgrade message khi đạt limit

- **File:** `src/app/(frontend)/core/components/molecules/TrialModeBanner/TrialModeBanner.tsx`
  - Hiển thị cả note count và chat count
  - Format: `📝 5/5 notes remaining | 💬 3/10 chats remaining`
  - Red banner khi đạt bất kỳ limit nào

#### Translations

- **File:** `src/app/(frontend)/core/i18n/locale/en/default.ts`

  - Thêm: `limitReached`, `upgradeMessage`, `remainingChats`

- **File:** `src/app/(frontend)/core/i18n/locale/vi/default.ts`
  - Thêm: `limitReached`, `upgradeMessage`, `remainingChats`

### 2. Cleanup Job cho Trial Notes Cũ

#### API Endpoint

- **File:** `src/app/api/cron/cleanup-trial-notes/route.ts`
  - POST: Xóa trial notes cũ hơn 7 ngày
  - GET: Dry run - kiểm tra notes sẽ bị xóa
  - Security: Protected by `CRON_SECRET`
  - Batch deletion: 100 vectors per batch
  - Logging: Chi tiết từng bước cleanup

#### Vercel Cron Configuration

- **File:** `vercel.json`
  - Cron schedule: `0 2 * * *` (mỗi ngày lúc 2 AM UTC)
  - Path: `/api/cron/cleanup-trial-notes`

#### Documentation

- **File:** `docs/CLEANUP_JOB.md`
  - Setup guide
  - API documentation
  - Testing instructions
  - Troubleshooting
  - Monitoring guide

### 3. Documentation Updates

#### Architecture Documentation

- **File:** `docs/TRIAL_PINECONE_ARCHITECTURE_VI.md`
  - Thêm section 11: Giới Hạn Trial Mode
  - Thêm section 12: Cleanup Job
  - Thêm section 13: Chi Phí Cập Nhật
  - Thêm section 14: Tóm Tắt Cuối Cùng
  - Update flow diagrams và examples

---

## 📊 Limits Summary

### Trial Mode Limits

| Resource  | Limit  | Storage                   |
| --------- | ------ | ------------------------- |
| Notes     | 5      | localStorage + Pinecone   |
| Chats     | 10     | localStorage (count only) |
| Retention | 7 days | Pinecone (auto cleanup)   |

### Storage Keys

```typescript
// localStorage keys
const TRIAL_NOTES_KEY = "trial-notes";
const TRIAL_CHAT_COUNT_KEY = "trial-chat-count";
```

---

## 🔄 User Flow

### 1. Trial User Creates Note

```
User creates note
  ↓
Check: noteCount < 5?
  ↓ Yes
Save to localStorage
  ↓
Sync to Pinecone (background)
  ↓
Update UI: Show remaining notes
```

### 2. Trial User Sends Chat

```
User sends chat message
  ↓
Check: chatCount < 10?
  ↓ Yes
Increment chat count
  ↓
Generate embedding
  ↓
Query Pinecone (semantic search)
  ↓
Send to Gemini
  ↓
Update UI: Show remaining chats
```

### 3. User Reaches Limit

```
User attempts action
  ↓
Check limit
  ↓ Reached
Show upgrade message
  ↓
Disable input/button
  ↓
Prompt: "Sign up to continue"
```

### 4. Cleanup Job (Daily)

```
Cron trigger (2 AM UTC)
  ↓
Query all trial notes
  ↓
Filter: createdAt < 7 days ago
  ↓
Delete in batches (100 each)
  ↓
Log statistics
```

---

## 💰 Cost Implications

### Per Trial User

```
5 notes × $0.00011 = $0.00055 (embeddings)
10 chats × $0.01 = $0.10 (AI + embeddings)
Total: ~$0.10055 per trial user
```

### Monthly (1000 trial users)

```
Notes: 1000 × $0.00055 = $0.55
Chats: 1000 × $0.10 = $100
Cleanup: ~$0.10
Total: ~$100.65/month
```

### Cost Optimization Options

1. **Reduce chat limit:** 10 → 5 chats (save 50%)
2. **Shorter retention:** 7 → 3 days (lower storage)
3. **Cleanup more frequently:** Daily → Twice daily

---

## 🔧 Setup Instructions

### 1. Environment Variables

```env
# Required for cleanup job
CRON_SECRET=your-secret-key-here
```

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Add trial mode limits and cleanup job"
git push origin main
```

### 3. Verify Deployment

1. Check Vercel dashboard → Cron jobs
2. Run manual dry run:
   ```bash
   curl -X GET https://your-app.vercel.app/api/cron/cleanup-trial-notes \
     -H "Authorization: Bearer ${CRON_SECRET}"
   ```

### 4. Monitor First Run

- Check logs after 2 AM UTC
- Verify statistics in response
- Ensure no errors

---

## 🧪 Testing

### Local Testing

1. **Test chat limit:**

   ```typescript
   // In browser console
   localStorage.setItem("trial-chat-count", "9");
   // Send one more chat → should hit limit
   ```

2. **Test cleanup endpoint:**

   ```bash
   # Dry run
   curl -X GET http://localhost:3000/api/cron/cleanup-trial-notes \
     -H "Authorization: Bearer test-secret"

   # Actual cleanup
   curl -X POST http://localhost:3000/api/cron/cleanup-trial-notes \
     -H "Authorization: Bearer test-secret"
   ```

### Production Testing

1. Create trial account with 9 chats
2. Verify banner shows "1 chat remaining"
3. Send 1 more chat
4. Verify limit reached message
5. Verify input disabled

---

## 📝 Files Modified

### Created Files

```
src/app/api/cron/cleanup-trial-notes/route.ts
vercel.json
docs/CLEANUP_JOB.md
docs/TRIAL_MODE_UPDATES.md (this file)
```

### Modified Files

```
src/app/(frontend)/core/utils/trialMode.ts
src/app/(frontend)/core/store/useTrialModeStore.ts
src/app/(frontend)/(modules)/notes/components/organisms/ChatBot/ChatBot.tsx
src/app/(frontend)/core/components/molecules/TrialModeBanner/TrialModeBanner.tsx
src/app/(frontend)/core/i18n/locale/en/default.ts
src/app/(frontend)/core/i18n/locale/vi/default.ts
docs/TRIAL_PINECONE_ARCHITECTURE_VI.md
```

---

## 🎉 Summary

### Completed Features

✅ Chat limit (10 requests) for trial mode
✅ UI displays remaining chats
✅ Disable chat input when limit reached
✅ Cleanup job for old trial notes (7 days)
✅ Vercel Cron configuration
✅ Comprehensive documentation
✅ English + Vietnamese translations
✅ Trial banner shows both limits

### Benefits

✅ Better cost control
✅ Predictable expenses
✅ Encourages sign-ups
✅ Professional trial experience
✅ Automated maintenance
✅ Scalable architecture

### Next Steps (Optional)

- Add analytics to track trial-to-paid conversion
- A/B test different limit values
- Add email reminder when limit is near
- Create admin dashboard for trial statistics
- Implement trial extension for special cases
