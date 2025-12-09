# Initialize Database - Quick Command

## Option 1: Using NPM Script (Recommended)

Run this command from your project root:

```bash
npm run init-db
```

This will:
- Connect to your MongoDB database (using `MONGO_DB_URL` from `.env.local`)
- Create all 9 collections if they don't exist
- Create all indexes for optimal performance
- Display a summary of what was created

## Option 2: Using API Endpoint

If your Next.js app is running, you can call:

```bash
curl -X POST http://localhost:3000/api/admin/init-db
```

Or use any HTTP client to POST to `/api/admin/init-db`

## Option 3: Direct Node Command

```bash
node scripts/init-db.mjs
```

## What Gets Created

The script creates these collections with all indexes:

1. ✅ **users** - User accounts synced with Clerk
2. ✅ **healthcareinstitutions** - Healthcare institution profiles
3. ✅ **vendors** - Vendor/seller profiles
4. ✅ **solutioncards** - Solution cards for Solutions Hub
5. ✅ **matches** - Matching relationships
6. ✅ **messages** - Communication between matches
7. ✅ **notifications** - User notifications
8. ✅ **activitylogs** - Audit trail
9. ✅ **savedsearches** - Saved search criteria

## Requirements

- `MONGO_DB_URL` must be set in `.env.local` or `.env`
- MongoDB connection must be accessible
- Node.js installed

## Note

Collections are also created automatically when you first use the models in your application. This script just ensures all indexes are created upfront for better performance.

