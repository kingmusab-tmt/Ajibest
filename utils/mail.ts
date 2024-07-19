import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.triplemultipurposetechnology.com.ng",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "info@triplemultipurposetechnology.com.ng",
    pass: "Nevers@1994",
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `http://localhost:3000/emailverification?token=${token}`; // Nowy format URL
  await transporter.sendMail({
    from: '"Ajibet" <info@triplemultipurposetechnology.com.ng>',
    to: email,
    subject: "Verify Your Email",
    html: `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
}
