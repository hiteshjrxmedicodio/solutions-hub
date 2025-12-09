# MongoDB Setup Guide

## Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
MONGO_DB_URL=mongodb+srv://hitesh24:Chintu%4024@hitesh.luyizc0.mongodb.net/
```

**Important:** The `@` symbol in the password needs to be URL-encoded as `%40`.

## Database Setup Steps

1. **Create the `.env.local` file** (if it doesn't exist) in the root directory:
   ```bash
   touch .env.local
   ```

2. **Add the MongoDB connection string** to `.env.local`:
   ```
   MONGO_DB_URL=mongodb+srv://hitesh24:Chintu%4024@hitesh.luyizc0.mongodb.net/
   ```

3. **Seed the database** with 25 solution cards by making a POST request to:
   ```
   http://localhost:3000/api/solutions/seed
   ```
   
   You can do this by:
   - Using curl: `curl -X POST http://localhost:3000/api/solutions/seed`
   - Using a REST client like Postman
   - Or visiting the URL in your browser (though POST requests work best with curl/Postman)

4. **Verify the data** by fetching cards:
   ```
   GET http://localhost:3000/api/solutions
   ```

## Database Structure

- **Collection Name:** `solutioncards`
- **Schema Fields:**
  - `id` (Number, unique, indexed)
  - `title` (String, max 200 chars)
  - `description` (String, max 500 chars)
  - `category` (String, optional, max 50 chars)
  - `cols` (Number, 1-4)
  - `rows` (Number, 1-2)
  - `createdAt` (Date, auto-generated)
  - `updatedAt` (Date, auto-generated)

## API Endpoints

- **GET `/api/solutions`** - Fetch all solution cards
- **POST `/api/solutions/seed`** - Seed database with 25 dummy cards

## Best Practices Implemented

✅ Connection pooling with global cache (prevents multiple connections in development)
✅ Schema validation with Mongoose
✅ Indexes on `id` and `category` for better query performance
✅ Error handling in API routes
✅ TypeScript types for type safety
✅ Environment variables for sensitive data
✅ Proper error messages and status codes

