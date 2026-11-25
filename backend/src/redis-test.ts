
import connection from "./redis.js";

async function testRedis() {
  try {
    const result = await connection.ping();
    console.log("Redis ping response:", result);
  } catch (error) {
    console.error("Redis test failed:", error);
  } finally {
    await connection.quit();
  }
}

testRedis();
