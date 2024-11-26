const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Agenda = require("agenda");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/email_scheduler", {});

const agenda = new Agenda({
  db: { address: "mongodb://localhost:27017/agenda" },
});

// Define the job
agenda.define("send email", async (job) => {
  const { to, subject, text } = job.attrs.data;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error.message);
  }
});

// Start the agenda
(async function () {
  await agenda.start();
})();

// POST API to schedule email in 60 minutes
app.post("/schedule-email/hour", async (req, res) => {
  const { email, subject, body } = req.body;

  await agenda.schedule(new Date(Date.now() + 60 * 60 * 1000), "send email", {
    to: email,
    subject,
    text: body,
  });

  res.send("Email scheduled successfully for 60 minutes later");
});

// POST API to schedule email in 60 seconds
app.post("/schedule-email/min", async (req, res) => {
  const { email, subject, body } = req.body;

  await agenda.schedule(new Date(Date.now() + 1 * 60 * 1000), "send email", {
    to: email,
    subject,
    text: body,
  });

  res.send("Email scheduled successfully for 60 seconds later");
});

// POST API to schedule email instantly
app.post("/schedule-email", async (req, res) => {
  const { email, subject, body } = req.body;

  await agenda.now("send email", {
    to: email,
    subject,
    text: body,
  });

  res.send("Email send Instantly");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
