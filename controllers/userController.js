const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Ambil data profil
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone_number, address, email } = user;
    return res.json({ name, phone_number, address, email });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Failed to load profile" });
  }
}

// Ganti nama atau nomor telepon
async function updateProfile(req, res) {
  const { name, phone_number } = req.body;

  // Validasi panjang
  if (name.length > 100) {
    return res
      .status(400)
      .json({ message: "Name too long (max 100 characters)" });
  }
  if (phone_number.length > 20) {
    return res
      .status(400)
      .json({ message: "Phone number too long (max 20 characters)" });
  }

  try {
    await User.updateProfile(req.user.id, { name, phone_number });
    return res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

// Ganti password
async function changePassword(req, res) {
  const { current_password, new_password } = req.body;

  // Validasi panjang password baru
  if (new_password.length < 6 || new_password.length > 100) {
    return res
      .status(400)
      .json({ message: "New password must be 6–100 characters" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(current_password, user.password);
    if (!match)
      return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.user.id, hashed);
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Failed to change password" });
  }
}

// Tambah atau ubah alamat
async function updateAddress(req, res) {
  const { address } = req.body;

  // Validasi panjang
  if (address.length > 255) {
    return res
      .status(400)
      .json({ message: "Address too long (max 255 characters)" });
  }

  try {
    await User.updateAddress(req.user.id, address);
    return res.json({ message: "Address updated" });
  } catch (err) {
    console.error("Update address error:", err);
    return res.status(500).json({ message: "Failed to update address" });
  }
}

module.exports = {
  updateProfile,
  changePassword,
  updateAddress,
  getProfile,
};
