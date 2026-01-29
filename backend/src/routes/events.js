import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await query("SELECT * FROM events ORDER BY data_evento DESC", []);
  return res.json(result.rows);
});

router.get("/:id", async (req, res) => {
  const result = await query("SELECT * FROM events WHERE id = $1", [req.params.id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Evento não encontrado." });
  }
  return res.json(result.rows[0]);
});

router.post("/", requireAuth, requireRole(["organizer"]), async (req, res) => {
  const { titulo, descricao, data_evento, local, requisitos } = req.body;
  if (!titulo || !data_evento || !local) {
    return res.status(400).json({ message: "Título, data e local são obrigatórios." });
  }

  const result = await query(
    `INSERT INTO events (organizer_id, titulo, descricao, data_evento, local, requisitos)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [req.user.id, titulo, descricao, data_evento, local, requisitos]
  );

  return res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, requireRole(["organizer"]), async (req, res) => {
  const { titulo, descricao, data_evento, local, requisitos } = req.body;
  const result = await query(
    `UPDATE events
     SET titulo = $1,
         descricao = $2,
         data_evento = $3,
         local = $4,
         requisitos = $5
     WHERE id = $6 AND organizer_id = $7
     RETURNING *`,
    [titulo, descricao, data_evento, local, requisitos, req.params.id, req.user.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Evento não encontrado ou sem permissão." });
  }

  return res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, requireRole(["organizer"]), async (req, res) => {
  const result = await query("DELETE FROM events WHERE id = $1 AND organizer_id = $2", [
    req.params.id,
    req.user.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Evento não encontrado ou sem permissão." });
  }

  return res.status(204).send();
});

export default router;
