
import nodemailer from "nodemailer";

async function createAccount() {
  const account = await nodemailer.createTestAccount();

  console.log("Ethereal account created!");
  console.log("SMTP Host:", account.smtp.host);
  console.log("SMTP Port:", account.smtp.port);
  console.log("SMTP User:", account.user);
  console.log("SMTP Password:", account.pass);
}

createAccount().catch(console.error);
