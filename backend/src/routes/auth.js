import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Dados obrigatórios ausentes." });
  }

  if (!['athlete', 'organizer'].includes(role)) {
    return res.status(400).json({ message: "Perfil inválido." });
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ message: "Email já cadastrado." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
    [email, passwordHash, role]
  );

  return res.status(201).json(result.rows[0]);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Credenciais inválidas." });
  }

  const result = await query("SELECT id, email, role, password_hash FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return res.json({ token });
});

export default router;
