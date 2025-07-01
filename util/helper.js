const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");
const { v4: uuidv4 } = require("uuid");
const RefreshToken = require("../models/RefreshToken");
const nodemailer = require("nodemailer");

const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const frontendURL = process.env.FRONTEND_URL;
  if (!frontendURL) {
    console.error("Frontend URL is not defined");
    return;
  }

  const verificationLink = `${frontendURL}/verify-email?token=${token}&email=${email}`;

  const mailOptions = {
    from: config.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please click the link below to verify your email:</p>
           <a href="${verificationLink}">Verify Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Failed to send verification email");
  }
}

async function sendResetPasswordEmail(email, token, url) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
  const resetLink = `${url}?token=${token}`;
  const mailOptions = {
    from: config.EMAIL_USER,
    to: email,
    subject: "Reset Password Anda",
    html: `<p>Silakan klik link di bawah untuk mereset password Anda:</p>
             <a href="${resetLink}">Reset Password</a>`,
  };
  await transporter.sendMail(mailOptions);
}

async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}
function issueAccessToken(payload) {
  return jwt.sign(payload, config.SECRET, { expiresIn: 60 * 60 }); //5 mins validity
}

async function createRefreshToken(user_id) {
  let expiryDate = new Date();
  expiryDate.setSeconds(60 * 60 * 24); //24 hours validity

  const token = uuidv4();
  const refreshToken = await RefreshToken.create({
    token,
    user_id: user_id,
    expiryDate: expiryDate.getTime(),
  });
  return refreshToken.token;
}

function verifyRefreshTokenExpiration(token) {
  return token.expiryDate.getTime() < new Date().getTime();
}

module.exports = {
  hashPassword,
  sendVerificationEmail,
  sendResetPasswordEmail,
  comparePassword,
  issueAccessToken,
  createRefreshToken,
  verifyRefreshTokenExpiration,
};
