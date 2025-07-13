// ... import tetap sama
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/RefreshToken");
const config = require("../util/config");
const { v4: uuidv4 } = require("uuid");
const helper = require("../util/helper");
const { registerSchema } = require("../util/authSchema");

// Register user
async function register(req, res) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, name, phone_number, password, address } = req.body;

  try {
    // Cek apakah email sudah terdaftar dan terverifikasi
    const existing = await User.findByEmail(email);
    if (existing) {
      if (existing.verified) {
        return res
          .status(400)
          .json({ message: "Email already used and verified." });
      } else {
        return res
          .status(400)
          .json({ message: "Email is already registered but not verified." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = uuidv4(); // Generate unique user_id

    // Buat user baru
    const user = await User.createUser({
      user_id,
      email,
      name,
      phone_number,
      password: hashedPassword,
      address,
      role: "user",
      verified: false,
    });

    // Hapus refresh token lama milik user sebelum membuat yang baru
    await RefreshToken.deleteByUserId(user_id);

    // Buat token akses baru dan refresh token
    const token = jwt.sign({ user_id: user.user_id }, config.SECRET, {
      expiresIn: "1d", // Access token expires in 1 day
    });

    const refreshToken = await helper.createRefreshToken(user.user_id); // Refresh token baru dibuat

    // Kirim email verifikasi
    await helper.sendVerificationEmail(email, token);

    // Kirim response sukses dengan access token dan refresh token
    return res.status(201).json({
      message: "Check your email to verify account.",
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed." });
  }
}

// Login user
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await helper.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    };
    const accessToken = helper.issueAccessToken(payload);
    const refreshToken = await helper.createRefreshToken(user.user_id);

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: payload,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login error." });
  }
}

// Verify token (email link)
async function verifyToken(req, res) {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, config.SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    return res.status(200).json({ token_valid: "valid" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ token_valid: "expired" });
    }
    return res.status(400).json({ token_valid: "not valid" });
  }
}

// Verify email
async function verifyEmail(req, res) {
  const { email } = req.params;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.setVerified(email);
    return res.status(200).json({ message: "Email berhasil diverifikasi" });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: "Verification error" });
  }
}

async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;

  try {
    const storedToken = await RefreshToken.findByTokenWithUser(token);
    if (!storedToken)
      return res.status(404).json({ message: "Invalid refresh token" });

    const expired = helper.verifyRefreshTokenExpiration(storedToken);
    if (expired) {
      await RefreshToken.deleteById(storedToken.id);
      return res.status(403).json({ message: "Refresh token expired" });
    }

    // HAPUS token lama sebelum buat baru
    await RefreshToken.deleteById(storedToken.id);

    const payload = {
      user_id: storedToken.user_id,
      email: storedToken.email,
      role: storedToken.role,
    };
    const newAccessToken = helper.issueAccessToken(payload);
    const newRefreshToken = await helper.createRefreshToken(payload.user_id);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Token refresh failed" });
  }
}

// Logout
async function logout(req, res) {
  try {
    await RefreshToken.deleteByUserId(req.user.user_id);
    req.session = null;
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout error:", err);
    res.status(500).json({ message: "Logout error" });
  }
}

async function whoami(req, res) {
  try {
    console.log("Decoded user from token:", req.user);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Whoami error:", err);
    return res.status(500).json({ message: "Failed to get user information" });
  }
}
module.exports = {
  register,
  login,
  verifyToken,
  verifyEmail,
  refreshToken,
  logout,
  whoami,
};
