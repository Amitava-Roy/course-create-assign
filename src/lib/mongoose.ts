// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define the types for the global cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend Node's global object (type-only, not a real var)
declare global {
  var mongoose: MongooseCache | undefined;
}

// Safely access the global object
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

// Initialize the cache if not already in the global object
const cached = globalWithMongoose.mongoose || { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose)
      .finally(() => {
        console.log("MongoDB connected");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;
