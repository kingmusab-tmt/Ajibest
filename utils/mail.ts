import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.triplemultipurposetechnology.com.ng",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.COMPANY_EMAIL_USER,
    pass: process.env.COMPANY_EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `http://localhost:3000/emailverification?token=${token}`; // Nowy format URL
  await transporter.sendMail({
    from: '"A.A Ajibest Land Vendors Limited" <info@triplemultipurposetechnology.com.ng>',
    to: email,
    subject: "Verify Your Email",
    html: `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
}
