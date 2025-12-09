# Database Schema Documentation

## Overview
This document describes the complete database schema for the Healthcare AI Solutions Hub platform. The database uses MongoDB with Mongoose ODM and integrates with Clerk for user authentication.

## Database: `solutions-hub`

## Tables (Collections)

### 1. `users`
**Purpose**: Central user table synced with Clerk authentication

**Fields**:
- `userId` (String, Unique, Indexed) - Clerk user ID (primary key)
- `clerkId` (String, Unique, Indexed) - Same as userId for consistency
- `email` (String, Required, Indexed) - User email from Clerk
- `emailVerified` (Boolean) - Email verification status
- `firstName` (String, Indexed) - User's first name
- `lastName` (String, Indexed) - User's last name
- `imageUrl` (String) - Profile image URL from Clerk
- `role` (Enum: 'buyer' | 'seller' | null, Indexed) - User role in application
- `hasInstitutionProfile` (Boolean, Indexed) - Whether user has completed institution profile
- `hasVendorProfile` (Boolean, Indexed) - Whether user has completed vendor profile
- `profileCompletedAt` (Date) - When profile was completed
- `preferences` (Object) - User preferences (notifications, language, timezone)
- `isActive` (Boolean, Indexed) - Account active status
- `lastLoginAt` (Date, Indexed) - Last login timestamp
- `lastActivityAt` (Date, Indexed) - Last activity timestamp
- `signUpSource` (String) - How user signed up
- `metadata` (Mixed) - Additional Clerk metadata
- `createdAt` (Date) - Record creation timestamp
- `updatedAt` (Date) - Record update timestamp

**Indexes**:
- `userId` (unique)
- `clerkId` (unique)
- `email`
- `role`
- `isActive`
- Compound: `{ role: 1, isActive: 1 }`
- Compound: `{ hasInstitutionProfile: 1, hasVendorProfile: 1 }`

**Relationships**:
- One-to-One with `healthcareinstitutions` (via userId)
- One-to-One with `vendors` (via userId)
- One-to-Many with `matches` (as institutionId or vendorId)
- One-to-Many with `messages` (as senderId or receiverId)
- One-to-Many with `notifications` (via userId)
- One-to-Many with `activitylogs` (via userId)
- One-to-Many with `savedsearches` (via userId)

---

### 2. `healthcareinstitutions`
**Purpose**: Healthcare institution profiles (buyers looking for solutions)

**Fields**: See `src/models/HealthcareInstitution.ts` for complete schema

**Key Fields**:
- `userId` (String, Unique, Indexed) - References users.userId
- `institutionName` (String, Required)
- `institutionType` (Enum, Required)
- `location` (Object: state, country)
- `primaryContact` (Object: name, title, email, phone)
- `secondaryContact` (Object, Optional)
- `medicalSpecialties` (Array)
- `currentSystems` (Array)
- `complianceRequirements` (Array)
- `primaryChallenges` (Array)
- `interestedSolutionAreas` (Array)
- `budgetRange` (String)
- `timeline` (String)
- `status` (Enum: 'draft' | 'submitted' | 'reviewed' | 'matched', Indexed)
- `submittedAt` (Date)

**Indexes**:
- `userId` (unique)
- `status`
- `institutionType`

**Relationships**:
- Many-to-One with `users` (via userId)
- One-to-Many with `matches` (as institutionId)

---

### 3. `vendors`
**Purpose**: Vendor/seller profiles offering AI solutions

**Fields**: See `src/models/Vendor.ts` for complete schema

**Key Fields**:
- `userId` (String, Unique, Indexed) - References users.userId
- `companyName` (String, Required)
- `companyType` (Enum, Required)
- `location` (Object: state, country)
- `primaryContact` (Object: name, title, email, phone)
- `solutionName` (String, Required)
- `solutionDescription` (String, Required)
- `solutionCategory` (Array, Indexed)
- `targetSpecialties` (Array, Indexed)
- `complianceCertifications` (Array)
- `pricingModel` (String)
- `pricingRange` (String)
- `status` (Enum: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected', Indexed)
- `submittedAt` (Date)

**Indexes**:
- `userId` (unique)
- `status`
- `solutionCategory`
- `targetSpecialties`

**Relationships**:
- Many-to-One with `users` (via userId)
- One-to-Many with `matches` (as vendorId)

---

### 4. `solutioncards`
**Purpose**: Solution cards displayed in the Solutions Hub grid

**Fields**:
- `id` (Number, Unique, Indexed) - Unique identifier
- `title` (String, Required)
- `description` (String, Required)
- `category` (String, Indexed)
- `cols` (Number, 1-4) - Grid column span
- `rows` (Number, 1-2) - Grid row span
- `createdAt` (Date)
- `updatedAt` (Date)

**Indexes**:
- `id` (unique)
- `category`

**Relationships**:
- One-to-Many with `matches` (via solutionCardId, optional)

---

### 5. `matches`
**Purpose**: Matching relationships between institutions and vendors

**Fields**:
- `institutionId` (String, Indexed) - References users.userId (institution)
- `vendorId` (String, Indexed) - References users.userId (vendor)
- `solutionCardId` (Number, Indexed, Optional) - References solutioncards.id
- `matchScore` (Number, 0-100) - Compatibility score
- `matchReasons` (Array) - Why they were matched
- `status` (Enum, Indexed) - Match status
- `institutionViewedAt` (Date)
- `vendorViewedAt` (Date)
- `institutionInterestedAt` (Date)
- `vendorInterestedAt` (Date)
- `firstContactAt` (Date)
- `lastInteractionAt` (Date)
- `institutionNotes` (String)
- `vendorNotes` (String)
- `adminNotes` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

**Indexes**:
- Compound: `{ institutionId: 1, vendorId: 1 }` (unique)
- `institutionId`
- `vendorId`
- `solutionCardId`
- `status`
- `matchScore` (descending)
- `createdAt` (descending)
- Compound: `{ institutionId: 1, status: 1 }`
- Compound: `{ vendorId: 1, status: 1 }`

**Relationships**:
- Many-to-One with `users` (as institutionId)
- Many-to-One with `users` (as vendorId)
- Many-to-One with `solutioncards` (via solutionCardId, optional)
- One-to-Many with `messages` (via matchId)

---

### 6. `messages`
**Purpose**: Messages between matched institutions and vendors

**Fields**:
- `matchId` (ObjectId, Indexed) - References matches._id
- `senderId` (String, Indexed) - References users.userId
- `receiverId` (String, Indexed) - References users.userId
- `senderRole` (Enum: 'buyer' | 'seller')
- `subject` (String, Optional)
- `content` (String, Required, Max 5000 chars)
- `messageType` (Enum: 'initial' | 'reply' | 'system')
- `isRead` (Boolean, Indexed)
- `readAt` (Date)
- `isDeletedBySender` (Boolean)
- `isDeletedByReceiver` (Boolean)
- `attachments` (Array of URLs)
- `createdAt` (Date)
- `updatedAt` (Date)

**Indexes**:
- `matchId`
- `senderId`
- `receiverId`
- `isRead`
- Compound: `{ matchId: 1, createdAt: -1 }`
- Compound: `{ receiverId: 1, isRead: 1, createdAt: -1 }`
- Compound: `{ senderId: 1, createdAt: -1 }`

**Relationships**:
- Many-to-One with `matches` (via matchId)
- Many-to-One with `users` (as senderId)
- Many-to-One with `users` (as receiverId)
- One-to-Many with `notifications` (via messageId)

---

### 7. `notifications`
**Purpose**: User notifications for matches, messages, and system events

**Fields**:
- `userId` (String, Indexed) - References users.userId
- `type` (Enum, Indexed) - Notification type
- `title` (String, Required)
- `message` (String, Required)
- `matchId` (ObjectId, Indexed, Optional) - References matches._id
- `messageId` (ObjectId, Indexed, Optional) - References messages._id
- `isRead` (Boolean, Indexed)
- `readAt` (Date)
- `actionUrl` (String, Optional)
- `actionLabel` (String, Optional)
- `createdAt` (Date)
- `updatedAt` (Date)

**Indexes**:
- `userId`
- `type`
- `isRead`
- `matchId`
- `messageId`
- Compound: `{ userId: 1, isRead: 1, createdAt: -1 }`
- Compound: `{ userId: 1, type: 1 }`

**Relationships**:
- Many-to-One with `users` (via userId)
- Many-to-One with `matches` (via matchId, optional)
- Many-to-One with `messages` (via messageId, optional)

---

### 8. `activitylogs`
**Purpose**: Audit trail and analytics for user activities

**Fields**:
- `userId` (String, Indexed) - References users.userId
- `userRole` (Enum: 'buyer' | 'seller', Indexed)
- `action` (String, Indexed) - Action performed
- `entityType` (Enum, Indexed) - Type of entity affected
- `entityId` (String, Indexed) - ID of affected entity
- `metadata` (Mixed) - Additional context
- `ipAddress` (String)
- `userAgent` (String)
- `createdAt` (Date) - Only created, never updated

**Indexes**:
- `userId`
- `userRole`
- `action`
- `entityType`
- `entityId`
- Compound: `{ userId: 1, createdAt: -1 }`
- Compound: `{ action: 1, createdAt: -1 }`
- Compound: `{ entityType: 1, entityId: 1 }`

**Relationships**:
- Many-to-One with `users` (via userId)

---

### 9. `savedsearches`
**Purpose**: Saved search criteria for users

**Fields**:
- `userId` (String, Indexed) - References users.userId
- `userRole` (Enum: 'buyer' | 'seller', Indexed)
- `name` (String, Required) - User-defined name
- `searchCriteria` (Object) - Search parameters
- `lastResultCount` (Number, Optional)
- `lastSearchedAt` (Date, Optional)
- `isActive` (Boolean, Indexed)
- `createdAt` (Date)
- `updatedAt` (Date)

**Indexes**:
- `userId`
- `userRole`
- `isActive`
- Compound: `{ userId: 1, isActive: 1 }`
- Compound: `{ userId: 1, createdAt: -1 }`

**Relationships**:
- Many-to-One with `users` (via userId)

---

## Clerk Integration

### Webhook Endpoints
- `POST /api/webhooks/clerk` - Handles Clerk webhook events:
  - `user.created` - Creates user in database
  - `user.updated` - Updates user data
  - `user.deleted` - Soft deletes user (marks as inactive)

### Sync Functions
- `syncClerkUserToDB()` - Syncs current user from Clerk to database
- `updateUserActivity()` - Updates user's last activity timestamp

---

## Database Design Principles

1. **Normalization**: Data is normalized to reduce redundancy
2. **Indexing**: Strategic indexes for common query patterns
3. **Referential Integrity**: Using userId strings to reference Clerk users
4. **Soft Deletes**: Users are marked inactive rather than deleted
5. **Audit Trail**: Activity logs track all important actions
6. **Scalability**: Compound indexes support efficient queries at scale
7. **Flexibility**: Mixed types and optional fields for future expansion

---

## Data Flow

1. **User Registration**: Clerk → Webhook → `users` table
2. **Profile Creation**: User fills questionnaire → `healthcareinstitutions` or `vendors` table
3. **Matching**: Algorithm creates matches → `matches` table
4. **Communication**: Users message → `messages` table
5. **Notifications**: System creates → `notifications` table
6. **Analytics**: Actions logged → `activitylogs` table

---

## Best Practices

1. Always sync user data from Clerk before operations
2. Use transactions for multi-document operations
3. Index frequently queried fields
4. Use compound indexes for multi-field queries
5. Log important activities for audit purposes
6. Soft delete users to preserve data integrity
7. Validate data at schema level and application level

