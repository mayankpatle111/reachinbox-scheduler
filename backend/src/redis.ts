
import "dotenv/config";
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is missing in .env");
}

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connected successfully!");
});

connection.on("error", (error: Error) => {
  console.error("Redis connection error:", error.message);
});

export default connection;
