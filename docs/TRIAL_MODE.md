# Trial Mode Implementation

## 1. Overview

Trial Mode allows users to access the AI Notes application without signing in. Users can create up to **5 notes** and use the **AI chatbot playground** with their trial notes stored in localStorage.

### 1.1 Key Features

- ✅ Access notes page without authentication
- ✅ Create up to 5 notes stored locally in browser
- ✅ Full note editing and deletion capabilities
- ✅ AI chatbot integration with trial notes
- ✅ Search and sort functionality
- ✅ Visual indicators for remaining trial notes
- ✅ Upgrade prompts to encourage sign-up

### 1.2 Limitations

- Notes stored in localStorage (browser-specific, not synced)
- Maximum 5 notes
- No cloud sync
- No cross-device access
- AI chat uses keyword matching instead of semantic search

---

## 2. Architecture

### 2.1 File Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── (modules)/
│   │   │   └── notes/
│   │   │       ├── page.tsx (updated for trial mode)
│   │   │       └── components/
│   │   │           ├── molecules/
│   │   │           │   └── AddEditNoteDialog/ (updated)
│   │   │           └── organisms/
│   │   │               ├── ChatBot/ (updated)
│   │   │               └── NotesGridClient/ (NEW)
│   │   └── core/
│   │       ├── components/
│   │       │   └── molecules/
│   │       │       ├── TrialModeBanner/ (NEW)
│   │       │       └── TrialLimitDialog/ (NEW)
│   │       ├── store/
│   │       │   └── useTrialModeStore.ts (NEW)
│   │       └── utils/
│   │           └── trialMode.ts (NEW)
│   └── api/
│       ├── (modules)/
│       │   └── chat/
│       │       ├── route.ts (updated)
│       │       ├── route.services.ts (updated)
│       │       └── route.types.ts (updated)
│       └── core/
│           └── utils/
│               └── auth.ts (updated)
```

---

## 3. Core Components

### 3.1 Trial Mode Utilities (`trialMode.ts`)

**Purpose**: Manage trial notes in localStorage

**Key Functions**:

- `getTrialNotes()` - Fetch all trial notes from localStorage
- `createTrialNote(title, content)` - Create new note (max 5)
- `updateTrialNote(id, title, content)` - Update existing note
- `deleteTrialNote(id)` - Delete a note
- `hasReachedTrialLimit()` - Check if limit reached
- `getRemainingTrialNotes()` - Get remaining note slots
- `convertTrialNoteToNote()` - Convert to Prisma Note type

**Storage Key**: `trial-notes`

### 3.2 Trial Mode Store (`useTrialModeStore.ts`)

**Purpose**: Zustand store for trial mode state management

**State**:

```typescript
{
  notes: TrialNote[]
  isTrialMode: boolean
  noteCount: number
  remainingNotes: number
  hasReachedLimit: boolean
}
```

**Actions**:

- `loadNotes()` - Load notes from localStorage
- `createNote(title, content)` - Create note via utility
- `updateNote(id, title, content)` - Update note via utility
- `deleteNote(id)` - Delete note via utility
- `refreshStats()` - Refresh counts and limits
- `setTrialMode(isTrialMode)` - Set trial mode status

### 3.3 Trial Mode Banner (`TrialModeBanner.tsx`)

**Purpose**: Display trial status and encourage sign-up

**Features**:

- Shows remaining notes count (X / 5 notes remaining)
- Changes color when limit reached
- "Sign Up" CTA button
- Responsive design (mobile-friendly)
- Auto-hides when user is authenticated

### 3.4 Trial Limit Dialog (`TrialLimitDialog.tsx`)

**Purpose**: Modal shown when trial limit is reached

**Features**:

- Lists premium features
- Prominent "Sign Up for Free" button
- "Maybe Later" option
- Sparkles icon for visual appeal

### 3.5 Notes Grid Client (`NotesGridClient.tsx`)

**Purpose**: Client-side notes grid for trial mode

**Features**:

- Loads notes from localStorage
- Client-side filtering and sorting
- No pagination (shows all trial notes)
- Syncs with URL search params
- Auto-refreshes when notes change

---

## 4. API Updates

### 4.1 Authentication Utilities

**New Functions**:

```typescript
// Get user ID or null (doesn't throw)
getOptionalUserId(): Promise<string | null>

// Check if user is authenticated
isAuthenticated(): Promise<boolean>
```

### 4.2 Chat API

**Updated Endpoint**: `POST /api/chat`

**Request Body**:

```typescript
{
  messages: ChatMessage[]
  trialNotes?: TrialNoteForChat[]  // NEW: For trial users
}
```

**Behavior**:

- If authenticated → fetch notes from database (semantic search)
- If trial mode → use provided trialNotes (keyword matching)

**New Service Function**:

```typescript
processChatRequestTrial(messages, trialNotes);
```

---

## 5. User Flow

### 5.1 Trial User Journey

1. **Access** `/notes` without signing in
2. **See** Trial Mode Banner showing "5 / 5 notes remaining"
3. **Create** first note → Banner updates to "4 / 5 remaining"
4. **Use** AI chatbot with trial notes
5. **Continue** creating notes until limit
6. **Hit limit** → Trial Limit Dialog appears
7. **Choose** to sign up or continue browsing

### 5.2 Authenticated User Journey

1. **Sign in** via `/sign-in`
2. **Access** `/notes` (no trial banner shown)
3. **Create** unlimited notes (stored in database)
4. **Use** AI chatbot with cloud-synced notes
5. **Access** from any device

---

## 6. Technical Details

### 6.1 Data Persistence

**Trial Mode**:

- Storage: `localStorage` (browser-specific)
- Key: `trial-notes`
- Format: JSON array of `TrialNote` objects
- Cleared when: User clears browser data
- NOT cleared when: User signs up (migration possible)

**Authenticated Mode**:

- Storage: PostgreSQL database via Prisma
- Synced: Across all devices
- Persisted: Permanently (until user deletes)

### 6.2 Trial Note Structure

```typescript
interface TrialNote {
  id: string; // "trial-{timestamp}-{random}"
  title: string;
  content: string | null;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

### 6.3 AI Chat Implementation

**Authenticated Users**:

- Uses Pinecone semantic search
- Fetches relevant notes from database
- Full context window

**Trial Users**:

- Uses simple keyword matching
- Searches title and content
- Limited to 3 most relevant notes
- Falls back to first 3 notes if no matches

---

## 7. UI/UX Considerations

### 7.1 Visual Indicators

- **Trial Banner**: Always visible for trial users
- **Progress**: "X / 5 notes remaining" clearly shown
- **Color Coding**:
  - Green/Blue → notes available
  - Red → limit reached
- **CTA Button**: Prominent "Sign Up" button

### 7.2 Error Handling

- **Limit Reached**: Shows dialog, not error toast
- **localStorage Full**: Graceful degradation
- **Chat Errors**: Same error handling as authenticated users

### 7.3 Responsive Design

- Banner stacks on mobile
- Dialog is mobile-friendly
- Notes grid adapts to screen size

---

## 8. Future Enhancements

### 8.1 Potential Improvements

1. **Migration on Sign-Up**

   - Transfer trial notes to user account
   - Preserve note content and timestamps
   - Clear localStorage after migration

2. **Extended Trial**

   - Allow more notes after email verification
   - Time-limited trial (7 days unlimited)

3. **Trial Analytics**

   - Track trial conversion rates
   - A/B test different limits (3 vs 5 vs 10 notes)
   - Monitor feature usage

4. **Social Proof**

   - Show "X users signed up today"
   - Display testimonials in limit dialog

5. **Progress Persistence**
   - Store trial start date
   - Show "You've been using trial for X days"

### 8.2 Technical Debt

1. **Testing**: Add unit tests for trial utilities
2. **E2E Tests**: Test trial flow end-to-end
3. **Error Boundaries**: Add error boundaries for trial components
4. **Accessibility**: Ensure ARIA labels and keyboard navigation

---

## 9. Configuration

### 9.1 Trial Limit Configuration

Located in: `src/app/(frontend)/core/utils/trialMode.ts`

```typescript
export const TRIAL_NOTE_LIMIT = 5;
```

To change the limit, update this constant and rebuild.

### 9.2 localStorage Key

```typescript
const TRIAL_NOTES_KEY = "trial-notes";
```

**Important**: Changing this key will lose existing trial data.

---

## 10. Testing Checklist

- [ ] Create first trial note
- [ ] Create 5 trial notes total
- [ ] Try to create 6th note → Dialog appears
- [ ] Edit trial note
- [ ] Delete trial note
- [ ] Search trial notes
- [ ] Sort trial notes (all 4 options)
- [ ] Use AI chat with trial notes
- [ ] Sign up after using trial
- [ ] Verify authenticated flow still works
- [ ] Test on mobile
- [ ] Test with localStorage disabled
- [ ] Clear localStorage and verify fresh start

---

## 11. Deployment Notes

### 11.1 Environment Variables

No new environment variables required.

### 11.2 Database Migrations

No database migrations required.

### 11.3 Breaking Changes

None. Existing authenticated users unaffected.

### 11.4 Rollback Plan

If issues arise:

1. Revert auth utilities to use `requireAuth()`
2. Revert notes page to authenticated-only
3. Remove trial mode components
4. Redeploy

---

## 12. Support & Troubleshooting

### 12.1 Common Issues

**Issue**: Trial notes not persisting

- **Cause**: localStorage disabled or full
- **Solution**: Enable localStorage or clear space

**Issue**: Chat not working in trial mode

- **Cause**: trialNotes not sent in request
- **Solution**: Verify useTrialModeStore provides notes

**Issue**: Banner not showing

- **Cause**: User is authenticated
- **Solution**: Expected behavior, banner only for trial users

### 12.2 Debug Mode

To debug trial mode:

```javascript
// In browser console
localStorage.getItem("trial-notes");
JSON.parse(localStorage.getItem("trial-notes") || "[]");
```

---

## 13. Conclusion

Trial Mode is successfully implemented with:

- ✅ 5-note limit enforcement
- ✅ AI chatbot integration
- ✅ User-friendly upgrade prompts
- ✅ No breaking changes to existing features
- ✅ Clean, maintainable code architecture

Users can now explore the application without signing up, increasing conversion opportunities while maintaining a premium upgrade path.
