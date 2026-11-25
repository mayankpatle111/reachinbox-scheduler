import express from "express";
import cors from "cors";
import { emailQueue } from "./emailQueue.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ReachInbox Email Scheduler API is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is healthy",
  });
});

const PORT = 3000;

app.post("/schedule-email", async (req, res) => {
  try {
    const { to, subject, text, scheduledAt, idempotencyKey } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({
        error: "to, subject and text are required",
      });
    }

    let delay = 0;

    if (scheduledAt) {
      const scheduledTime = new Date(scheduledAt).getTime();

      if (Number.isNaN(scheduledTime)) {
        return res.status(400).json({
          error: "Invalid scheduledAt date",
        });
      }

      delay = Math.max(0, scheduledTime - Date.now());
    }

const job = await emailQueue.add(
  "send-email",
  { to, subject, text },
  {
    delay,
    ...(idempotencyKey
      ? { jobId: String(idempotencyKey).replace(/:/g, "-") }
      : {}),
  }
);




    res.status(201).json({
      message: "Email added to queue",
      jobId: job.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to schedule email",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
