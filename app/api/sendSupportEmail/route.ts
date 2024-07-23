import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.triplemultipurposetechnology.com.ng",
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL_USER,
      pass: process.env.COMPANY_EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: `Support Request from ${name}: ${subject}`,
      text: message,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email", error },
      { status: 500 }
    );
  }
};
