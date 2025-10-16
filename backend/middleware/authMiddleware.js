import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      const userQuery = await pool.query(
        "SELECT id, name, email FROM users WHERE id=$1",
        [decoded.id]
      );
      if (userQuery.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = userQuery.rows[0];
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
