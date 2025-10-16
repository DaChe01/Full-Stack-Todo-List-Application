import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExists.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const token = generateToken(user.rows[0].id);

    res.status(201).json({
      token,
      name: user.rows[0].name,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.rows[0].id);

    res.json({
      token,
      name: user.rows[0].name,
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
