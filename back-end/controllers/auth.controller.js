import { pool } from "../server.js";
import bcrypt from "bcrypt";
import { generateToken } from "../routes/utils/generateToken.js";

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }
    const checkPassword = await bcrypt.compare(
      password,
      existingUser.rows[0].password
    );

    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(existingUser.rows[0])
    res.status(200).json({token, user: {id: existingUser.rows[0].id, role: existingUser.rows[0].role, email: existingUser.rows[0].email, message: "Login successful" }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "Email already registered" });
    }
    const result = await pool.query(
      `INSERT INTO customers(name, email, password)
    VALUES ($1, $2, $3) RETURNING id;`,
      [name, email, hashedPassword]
    );
    const token = generateToken(result.rows[0])
    res.status(201).json({ token, user: {id: result.rows[0].id, role: result.rows[0].role, email: result.rows[0].email, message: "Customers added successfully" }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {

  loginClient,
  registerClient,
};
