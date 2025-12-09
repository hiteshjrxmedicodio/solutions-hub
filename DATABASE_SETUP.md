# Database Setup Guide

## Overview
This guide will help you set up and initialize the database for the Healthcare AI Solutions Hub platform.

## Prerequisites
1. MongoDB database (local or cloud - MongoDB Atlas)
2. MongoDB connection string in `.env.local`
3. Clerk account with webhook secret configured

## Environment Variables

Add these to your `.env.local` file:

```env
# MongoDB Connection
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/solutions-hub

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook Secret (for webhook endpoint)
WEBHOOK_SECRET=whsec_...
```

## Database Collections

The following collections will be automatically created when you first use the models:

1. **users** - User accounts synced with Clerk
2. **healthcareinstitutions** - Healthcare institution profiles (buyers)
3. **vendors** - Vendor/seller profiles
4. **solutioncards** - Solution cards for the Solutions Hub
5. **matches** - Matching relationships between buyers and sellers
6. **messages** - Messages between matched parties
7. **notifications** - User notifications
8. **activitylogs** - Audit trail and analytics
9. **savedsearches** - Saved search criteria

## Initialization

### Option 1: Automatic (Recommended)
Collections and indexes are created automatically when models are first used. No manual setup required.

### Option 2: Manual Initialization
Call the initialization endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/init-db
```

Or use the initialization script:

```bash
npx ts-node src/lib/initDatabase.ts
```

## Clerk Webhook Setup

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the webhook signing secret to `WEBHOOK_SECRET` in `.env.local`

## Database Schema

See `DATABASE_SCHEMA.md` for complete schema documentation.

## Indexes

All collections have strategic indexes for optimal query performance:
- Single field indexes on frequently queried fields
- Compound indexes for multi-field queries
- Unique indexes to prevent duplicates
- Sparse indexes for optional fields

## Data Relationships

```
users (1) ──< (1) healthcareinstitutions
users (1) ──< (1) vendors
users (1) ──< (*) matches (as institutionId)
users (1) ──< (*) matches (as vendorId)
matches (1) ──< (*) messages
users (1) ──< (*) notifications
users (1) ──< (*) activitylogs
users (1) ──< (*) savedsearches
```

## Best Practices

1. **Always sync user data from Clerk** before operations
2. **Use transactions** for multi-document operations
3. **Log important activities** for audit purposes
4. **Soft delete users** to preserve data integrity
5. **Index frequently queried fields** for performance

## Troubleshooting

### Connection Issues
- Verify `MONGO_DB_URL` is correct
- Check if password contains special characters (should be URL-encoded)
- Ensure database name is `solutions-hub`

### Webhook Issues
- Verify `WEBHOOK_SECRET` matches Clerk dashboard
- Check webhook endpoint is accessible
- Review server logs for errors

### Index Creation
- Indexes are created automatically on first use
- Use `createIndexes()` method to ensure all indexes exist
- Check MongoDB logs for index creation errors

## Maintenance

### Regular Tasks
1. Monitor database size and performance
2. Review activity logs for anomalies
3. Clean up old activity logs (optional)
4. Backup database regularly
5. Review and optimize slow queries

### Performance Optimization
- Use compound indexes for multi-field queries
- Limit query results with pagination
- Use projections to limit returned fields
- Monitor query performance with MongoDB profiler

