
import { Worker } from "bullmq";
import connection from "./redis.js";
import transporter from "./mailer.js";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Processing email job:", job.id);

    const { to, subject, text } = job.data;

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return { messageId: info.messageId };
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

console.log("Email worker is running!");
