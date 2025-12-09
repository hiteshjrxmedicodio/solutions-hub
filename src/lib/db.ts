import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGO_DB_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_DB_URL environment variable in your .env file');
}

// Handle local MongoDB connections - ensure database name is set
if (MONGODB_URI.includes('mongodb://') && !MONGODB_URI.includes('mongodb+srv://')) {
  // For local MongoDB, if no database name is specified, use 'local'
  if (!MONGODB_URI.includes('/') || MONGODB_URI.split('@').length > 1 && MONGODB_URI.split('@')[1].split('/').length === 1) {
    // No database name after host, add /local
    if (!MONGODB_URI.endsWith('/')) {
      MONGODB_URI = MONGODB_URI + '/local';
    } else {
      MONGODB_URI = MONGODB_URI + 'local';
    }
  }
}

// Fix connection string if password or username contains unencoded @ character
// MongoDB connection strings require @ in passwords/usernames to be URL-encoded as %40
if (MONGODB_URI.includes('mongodb+srv://')) {
  // If connection string already has %40, assume it's properly encoded
  // Otherwise, we need to encode @ characters in username and password
  if (!MONGODB_URI.includes('%40')) {
    // Find the last @ which separates credentials from hostname
    const lastAtIndex = MONGODB_URI.lastIndexOf('@');
    
    if (lastAtIndex > 0) {
      const beforeAt = MONGODB_URI.substring(0, lastAtIndex);
      const afterAt = MONGODB_URI.substring(lastAtIndex + 1);
      
      // Extract protocol
      const protocolMatch = beforeAt.match(/^(mongodb\+srv:\/\/)/);
      if (protocolMatch) {
        const protocol = protocolMatch[1];
        const credentials = beforeAt.substring(protocol.length);
        
        // Split username and password
        const colonIndex = credentials.indexOf(':');
        if (colonIndex > 0) {
          const username = credentials.substring(0, colonIndex);
          const password = credentials.substring(colonIndex + 1);
          
          // URL-encode @ characters
          const encodedUsername = encodeURIComponent(username);
          const encodedPassword = encodeURIComponent(password);
          
          MONGODB_URI = `${protocol}${encodedUsername}:${encodedPassword}@${afterAt}`;
        }
      }
    }
  }
  
  // Ensure the database name "solutions-hub" is specified
  const uriParts = MONGODB_URI.split('?');
  const baseUri = uriParts[0];
  const queryParams = uriParts.length > 1 ? '?' + uriParts[1] : '';
  
  // Find where hostname starts (after the last @)
  const lastAtIndex = baseUri.lastIndexOf('@');
  
  if (lastAtIndex > 0) {
    const afterAt = baseUri.substring(lastAtIndex + 1);
    const slashIndex = afterAt.indexOf('/');
    
    if (slashIndex > 0) {
      // Database name exists, replace it
      const hostname = afterAt.substring(0, slashIndex);
      const beforeAt = baseUri.substring(0, lastAtIndex + 1);
      MONGODB_URI = `${beforeAt}${hostname}/solutions-hub${queryParams}`;
    } else {
      // No database name, add it
      MONGODB_URI = `${baseUri}/solutions-hub${queryParams}`;
    }
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global cache to prevent multiple connections in development
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

