# Trial Notes Cleanup Job

## Overview

Automated cron job to clean up old trial notes from Pinecone vector database.

## Purpose

Trial users store their notes in localStorage (frontend) and Pinecone (vector embeddings). Since all trial notes use the same `userId: "trial-user"`, they accumulate over time. This cleanup job removes trial notes older than 7 days to:

- Reduce Pinecone storage costs
- Maintain optimal query performance
- Prevent unlimited growth of trial data

## Configuration

### Environment Variables

```env
CRON_SECRET=your-secret-key-here
```

**Important:** Keep this secret secure! It protects the cleanup endpoint from unauthorized access.

### Vercel Cron Setup

The job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-trial-notes",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Schedule:** Daily at 2:00 AM UTC

### Alternative: GitHub Actions

If not using Vercel Cron, you can use GitHub Actions instead.

Create `.github/workflows/cleanup-trial-notes.yml`:

```yaml
name: Cleanup Trial Notes

on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger cleanup
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/cleanup-trial-notes \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Required secrets:**

- `APP_URL`: Your app domain (e.g., https://your-app.vercel.app)
- `CRON_SECRET`: Same secret as in your app's environment

## API Endpoints

### POST /api/cron/cleanup-trial-notes

Deletes trial notes older than 7 days.

**Request:**

```bash
curl -X POST https://your-domain.com/api/cron/cleanup-trial-notes \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

**Response (success):**

```json
{
  "success": true,
  "deleted": 42,
  "cutoffDate": "2024-11-06T02:00:00.000Z",
  "message": "Successfully cleaned up 42 trial notes older than 7 days"
}
```

**Response (no notes to delete):**

```json
{
  "success": true,
  "deleted": 0,
  "message": "No old trial notes to clean up"
}
```

**Response (error):**

```json
{
  "error": "Failed to cleanup trial notes",
  "details": "Error message here"
}
```

### GET /api/cron/cleanup-trial-notes

Dry run - check what would be deleted without actually deleting.

**Request:**

```bash
curl -X GET https://your-domain.com/api/cron/cleanup-trial-notes \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

**Response:**

```json
{
  "success": true,
  "dryRun": true,
  "cutoffDate": "2024-11-06T02:00:00.000Z",
  "stats": {
    "totalTrialNotes": 150,
    "oldNotes": 42,
    "recentNotes": 108,
    "wouldDelete": 42
  },
  "message": "Would delete 42 trial notes older than 7 days"
}
```

## How It Works

### Flow

1. **Verify Authorization**

   - Check `Authorization: Bearer ${CRON_SECRET}` header
   - Return 401 if invalid

2. **Calculate Cutoff Date**

   ```typescript
   const sevenDaysAgo = new Date();
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
   ```

3. **Query Pinecone**

   - Query for all trial notes (`userId: "trial-user"`)
   - Filter by `createdAt < cutoffDate`

4. **Delete in Batches**

   - Delete up to 100 vectors per batch (Pinecone limit)
   - Continue until all old notes are deleted

5. **Return Statistics**
   - Total deleted count
   - Cutoff date used
   - Success message

### Code

```typescript
// Query for trial notes
const queryResponse = await notesIndex.query({
  vector: dummyVector,
  topK: 10000,
  filter: {
    userId: { $eq: "trial-user" },
  },
  includeMetadata: true,
});

// Filter by date
const notesToDelete = queryResponse.matches.filter((match) => {
  const createdAt = match.metadata?.createdAt as string;
  return new Date(createdAt) < sevenDaysAgo;
});

// Delete in batches
for (let i = 0; i < idsToDelete.length; i += 100) {
  const batch = idsToDelete.slice(i, i + 100);
  await notesIndex.deleteMany(batch);
}
```

## Testing

### Local Testing

1. **Set up environment:**

   ```bash
   # .env.local
   CRON_SECRET=test-secret-123
   ```

2. **Run dry run:**

   ```bash
   curl -X GET http://localhost:3000/api/cron/cleanup-trial-notes \
     -H "Authorization: Bearer test-secret-123"
   ```

3. **Check what would be deleted:**

   - Review the `stats` object in response
   - Verify `wouldDelete` count makes sense

4. **Run actual cleanup:**

   ```bash
   curl -X POST http://localhost:3000/api/cron/cleanup-trial-notes \
     -H "Authorization: Bearer test-secret-123"
   ```

5. **Verify deletion:**
   - Check Pinecone dashboard for vector count change
   - Review logs for success messages

### Production Testing

**Before enabling cron:**

1. Deploy the endpoint
2. Run manual dry run to verify behavior
3. Check Pinecone dashboard for trial note count
4. Run actual cleanup once manually
5. Verify logs and results
6. Enable Vercel Cron

**Monitor first few runs:**

- Check Vercel logs for cron execution
- Verify cleanup statistics
- Ensure no errors

## Monitoring

### Vercel Logs

View cron job execution in Vercel dashboard:

- Project → Functions → Logs
- Filter by `/api/cron/cleanup-trial-notes`

### Expected Logs

**Success:**

```
[Cleanup] Starting cleanup for trial notes older than 2024-11-06T02:00:00.000Z
[Cleanup] Deleting 42 old trial notes
[Cleanup] Deleted batch: 42/42
[Cleanup] Successfully deleted 42 old trial notes
```

**No notes:**

```
[Cleanup] No old trial notes found
```

**Error:**

```
[Cleanup] Error cleaning up trial notes: [error details]
```

## Troubleshooting

### Issue: 401 Unauthorized

**Cause:** Invalid or missing CRON_SECRET

**Solution:**

1. Check environment variable is set: `echo $CRON_SECRET`
2. Verify header format: `Authorization: Bearer ${CRON_SECRET}`
3. Regenerate secret if compromised

### Issue: 500 Server Error

**Cause:** Pinecone connection or query error

**Solution:**

1. Check Pinecone credentials in environment
2. Verify Pinecone index exists
3. Check Pinecone dashboard for service status
4. Review detailed error in logs

### Issue: Deleting too many notes

**Cause:** Cutoff date calculation might be wrong

**Solution:**

1. Run dry run (GET) first to verify
2. Check `cutoffDate` in response
3. Adjust date calculation if needed:
   ```typescript
   // Change from 7 to 14 days
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);
   ```

### Issue: Cron not executing

**Cause:** Vercel cron not configured or deployed

**Solution:**

1. Check `vercel.json` exists and is correct
2. Redeploy to production
3. Check Vercel dashboard → Cron jobs
4. Verify schedule format is valid

## Customization

### Change Retention Period

To keep trial notes for 14 days instead of 7:

```typescript
// In route.ts
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
```

### Change Schedule

To run every 12 hours:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-trial-notes",
      "schedule": "0 */12 * * *"
    }
  ]
}
```

Common schedules:

- `0 2 * * *` - Daily at 2 AM
- `0 */12 * * *` - Every 12 hours
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 0 1 * *` - Monthly on the 1st at midnight

### Add Webhook Notification

To get notified when cleanup runs:

```typescript
// After successful cleanup
await fetch("YOUR_WEBHOOK_URL", {
  method: "POST",
  body: JSON.stringify({
    event: "trial-notes-cleanup",
    deleted: totalDeleted,
    cutoffDate,
    timestamp: new Date().toISOString(),
  }),
});
```

## Security Considerations

1. **Secret Management**

   - Never commit CRON_SECRET to git
   - Use strong, random secrets (32+ characters)
   - Rotate secrets periodically

2. **Authorization**

   - Always verify Bearer token
   - Return 401 for invalid tokens
   - Don't expose error details to unauthorized callers

3. **Rate Limiting**

   - Consider adding rate limiting for public endpoints
   - Vercel Cron is already protected (can't be called externally)

4. **Logging**
   - Log all cleanup operations
   - Don't log sensitive data
   - Monitor for unusual patterns

## Cost Implications

### Pinecone Costs

- **Without cleanup:** Unlimited growth → increasing monthly costs
- **With cleanup:** Bounded growth → predictable costs

**Estimate:**

- Average 1000 trial users/day
- Each creates 5 notes
- 7-day retention: ~35,000 vectors max
- Monthly cost: ~$20-30 (depending on Pinecone plan)

### Vercel Cron

- Vercel Cron is free on Pro plan
- Execution time: ~1-2 seconds per run
- Negligible impact on function usage

## Related Documentation

- [TRIAL_PINECONE_ARCHITECTURE_VI.md](./TRIAL_PINECONE_ARCHITECTURE_VI.md) - Full trial mode architecture
- [TRIAL_MODE.md](./TRIAL_MODE.md) - Trial mode overview
- [Vercel Cron Documentation](https://vercel.com/docs/cron-jobs)
- [Pinecone Documentation](https://docs.pinecone.io/)
