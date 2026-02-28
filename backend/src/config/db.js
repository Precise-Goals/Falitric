const mongoose = require("mongoose");
const Redis = require("ioredis");

let redisClient;

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/faltric";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

async function connectRedis() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  try {
    await redisClient.connect();
    console.log("Redis connected:", url);
  } catch (err) {
    console.warn("Redis connection failed (continuing without cache):", err.message);
  }
}

function getRedis() {
  return redisClient;
}

module.exports = { connectDB, connectRedis, getRedis };
