# Trial Mode - Quick Start Guide

## What is Trial Mode?

Trial Mode allows users to try the AI Notes application **without signing up**. They can:

- Create up to **5 notes** (stored in browser)
- Use the **AI chatbot** with their trial notes
- Experience all core features

## How It Works

### For Users

1. Visit `/notes` without signing in
2. See a trial banner: "5 / 5 notes remaining"
3. Create notes and chat with AI
4. Hit the limit → See upgrade prompt
5. Sign up for unlimited access

### For Developers

**Key Files Created:**

- `src/app/(frontend)/core/utils/trialMode.ts` - Trial note management
- `src/app/(frontend)/core/store/useTrialModeStore.ts` - State management
- `src/app/(frontend)/core/components/molecules/TrialModeBanner/` - Status banner
- `src/app/(frontend)/core/components/molecules/TrialLimitDialog/` - Upgrade prompt
- `src/app/(frontend)/(modules)/notes/components/organisms/NotesGridClient/` - Client-side grid

**Key Files Updated:**

- `src/app/(frontend)/(modules)/notes/page.tsx` - Conditional rendering
- `src/app/api/core/utils/auth.ts` - Optional auth support
- `src/app/api/(modules)/chat/route.ts` - Trial mode handling
- `src/app/(frontend)/(modules)/notes/components/molecules/AddEditNoteDialog/` - Trial limits

## Configuration

Change the trial limit in `trialMode.ts`:

```typescript
export const TRIAL_NOTE_LIMIT = 5; // Change to 3, 10, etc.
```

## Testing

```bash
# Test in browser (no sign-in required)
npm run dev
# Visit http://localhost:3000/notes

# Debug trial data in browser console
localStorage.getItem('trial-notes')
```

## Documentation

See full documentation: `docs/TRIAL_MODE.md`

## Migration Path

When user signs up, trial notes remain in localStorage. Future enhancement can migrate them to the database automatically.
