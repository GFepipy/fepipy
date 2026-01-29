import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/events/:eventId/applications", requireAuth, requireRole(["athlete"]), async (req, res) => {
  const { observacoes } = req.body;
  const result = await query(
    `INSERT INTO applications (event_id, athlete_user_id, status, observacoes)
     VALUES ($1, $2, 'pendente', $3)
     RETURNING *`,
    [req.params.eventId, req.user.id, observacoes]
  );

  return res.status(201).json(result.rows[0]);
});

router.get(
  "/events/:eventId/applications",
  requireAuth,
  requireRole(["organizer"]),
  async (req, res) => {
    const result = await query(
      `SELECT applications.*, athletes.nome AS atleta_nome
       FROM applications
       JOIN athletes ON athletes.user_id = applications.athlete_user_id
       JOIN events ON events.id = applications.event_id
       WHERE applications.event_id = $1 AND events.organizer_id = $2
       ORDER BY applications.created_at DESC`,
      [req.params.eventId, req.user.id]
    );

    return res.json(result.rows);
  }
);

router.patch(
  "/applications/:id/status",
  requireAuth,
  requireRole(["organizer"]),
  async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status obrigatório." });
    }

    const result = await query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Candidatura não encontrada." });
    }

    return res.json(result.rows[0]);
  }
);

export default router;
