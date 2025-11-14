# Google Analytics Setup

## 1. Overview

Google Analytics 4 (GA4) has been integrated into the application to track user behavior and key events. The implementation includes:

- Page view tracking
- User sign up/sign in events
- Note creation and deletion
- Chat message tracking
- Trial limit reached events

## 2. Environment Setup

### 2.1 Add Measurement ID

Add your Google Analytics Measurement ID to your environment variables:

```bash
# .env.local or .env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Important**: The environment variable must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 2.2 Get Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or select an existing one
3. Navigate to **Admin** → **Data Streams**
4. Select your web data stream
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## 3. Implementation Details

### 3.1 Core Utility (`analytics.ts`)

Location: `/src/app/(frontend)/core/utils/analytics.ts`

**Key Functions:**

```typescript
// Check if GA is available
isGAEnabled(): boolean

// Track page views
gtagPageview(url: string): void

// Generic event tracking
gtagEvent(action: string, params?: Record<string, any>): void

// Specific event helpers
trackSignUp(method: string): void
trackSignIn(method: string): void
trackNoteCreated(isTrialMode: boolean): void
trackNoteDeleted(isTrialMode: boolean): void
trackChatMessage(isTrialMode: boolean): void
trackTrialLimitReached(limitType: "notes" | "chat"): void
```

### 3.2 Global Setup (`layout.tsx`)

Location: `/src/app/layout.tsx`

The Google Analytics scripts are loaded in the root layout using Next.js `Script` component:

- `strategy="afterInteractive"` ensures scripts load after the page becomes interactive
- Conditional rendering based on `GA_MEASUREMENT_ID` existence
- Initializes `dataLayer` and configures GA with the measurement ID

### 3.3 Event Tracking Locations

#### Sign Up Events

- **File**: `SignUpPage.tsx`
- **Events**:
  - `trackSignUp("email")` - Email/password sign up
  - `trackSignUp("google")` - Google OAuth sign up

#### Sign In Events

- **File**: `SignInPage.tsx`
- **Events**:
  - `trackSignIn("email")` - Email/password sign in
  - `trackSignIn("google")` - Google OAuth sign in

#### Note Events

- **File**: `AddEditNoteDialog.tsx`
- **Events**:
  - `trackNoteCreated(isTrialMode)` - When a note is created
  - `trackNoteDeleted(isTrialMode)` - When a note is deleted
  - Tracks both trial and authenticated users separately

#### Chat Events

- **File**: `ChatBot.tsx`
- **Events**:
  - `trackChatMessage(isTrialMode)` - When a chat message is sent
  - Differentiates between trial and authenticated users

#### Trial Limit Events

- **File**: `TrialLimitDialog.tsx`
- **Events**:
  - `trackTrialLimitReached("notes")` - When trial user hits note limit
  - Triggered automatically when the dialog opens

## 4. Tracked Events

### 4.1 Authentication Events

| Event Name | Parameters                    | Description                       |
| ---------- | ----------------------------- | --------------------------------- |
| `sign_up`  | `method: "email" \| "google"` | User creates a new account        |
| `login`    | `method: "email" \| "google"` | User signs in to existing account |

### 4.2 Note Events

| Event Name    | Parameters                                               | Description             |
| ------------- | -------------------------------------------------------- | ----------------------- |
| `create_note` | `category: "notes"`, `label: "trial" \| "authenticated"` | User creates a new note |
| `delete_note` | `category: "notes"`, `label: "trial" \| "authenticated"` | User deletes a note     |

### 4.3 Chat Events

| Event Name     | Parameters                                              | Description               |
| -------------- | ------------------------------------------------------- | ------------------------- |
| `send_message` | `category: "chat"`, `label: "trial" \| "authenticated"` | User sends a chat message |

### 4.4 Trial Events

| Event Name            | Parameters                                           | Description              |
| --------------------- | ---------------------------------------------------- | ------------------------ |
| `trial_limit_reached` | `category: "trial"`, `limit_type: "notes" \| "chat"` | Trial user reaches limit |

## 5. Testing

### 5.1 Local Testing

1. Add your measurement ID to `.env.local`:

   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
   ```

2. Start the development server:

   ```bash
   bun run dev
   ```

3. Open browser DevTools → Console
4. Verify GA script is loaded (no errors)
5. Use [Google Analytics DebugView](https://support.google.com/analytics/answer/7201382)

### 5.2 DebugView

Enable debug mode by installing the [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### 5.3 Production Testing

Events may take 24-48 hours to appear in standard GA4 reports, but they appear immediately in:

- **DebugView** (for testing)
- **Realtime** report (for production)

## 6. Best Practices

### 6.1 Privacy Compliance

- GA4 is GDPR compliant by default with IP anonymization
- Consider adding a cookie consent banner for EU users
- Review [Google Analytics Data Privacy](https://support.google.com/analytics/answer/6004245)

### 6.2 Data Collection

- All events include user agent and page information automatically
- Trial vs authenticated user tracking helps understand conversion funnel
- Event parameters help segment user behavior

### 6.3 Maintenance

- Review tracked events quarterly
- Update event parameters as features evolve
- Monitor for tracking errors in GA4 DebugView

## 7. Troubleshooting

### 7.1 Events Not Showing

**Problem**: Events are tracked in code but not appearing in GA4

**Solutions**:

1. Check environment variable is set correctly
2. Verify measurement ID format: `G-XXXXXXXXXX`
3. Ensure `NEXT_PUBLIC_` prefix is used
4. Check browser console for errors
5. Verify GA4 property is active (not deleted/archived)

### 7.2 Script Not Loading

**Problem**: GA script fails to load

**Solutions**:

1. Check ad blockers are disabled (for testing)
2. Verify internet connection
3. Check browser console for CSP errors
4. Ensure measurement ID is valid

### 7.3 Duplicate Events

**Problem**: Events are tracked multiple times

**Solutions**:

1. Check if tracking function is called multiple times
2. Verify `useEffect` dependencies are correct
3. Use React DevTools to check for unnecessary re-renders

## 8. Future Enhancements

- Add custom dimensions for user properties
- Track page scroll depth
- Monitor form abandonment rates
- Add e-commerce tracking (if applicable)
- Set up conversion goals in GA4
- Create custom reports for key metrics
- Set up automated alerts for anomalies

## 9. Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Integration](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Google Tag Manager Guide](https://support.google.com/tagmanager/answer/6103696)
