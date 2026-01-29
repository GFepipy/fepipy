import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { idade, posicao, cidade, status } = req.query;
  const filters = [];
  const values = [];

  if (idade) {
    values.push(Number(idade));
    filters.push(`idade = $${values.length}`);
  }
  if (posicao) {
    values.push(posicao);
    filters.push(`posicao ILIKE $${values.length}`);
  }
  if (cidade) {
    values.push(cidade);
    filters.push(`cidade ILIKE $${values.length}`);
  }
  if (status) {
    values.push(status);
    filters.push(`status = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(`SELECT * FROM athletes ${where} ORDER BY created_at DESC`, values);
  return res.json(result.rows);
});

router.get("/:id", async (req, res) => {
  const result = await query("SELECT * FROM athletes WHERE id = $1", [req.params.id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Atleta não encontrado." });
  }
  return res.json(result.rows[0]);
});

router.post("/", requireAuth, requireRole(["athlete"]), async (req, res) => {
  const {
    nome,
    idade,
    posicao,
    cidade,
    altura,
    peso,
    estatisticas,
    habilidades,
    videos,
    status,
    contatos,
  } = req.body;

  if (!nome || !idade || !posicao) {
    return res.status(400).json({ message: "Nome, idade e posição são obrigatórios." });
  }

  const result = await query(
    `INSERT INTO athletes
      (user_id, nome, idade, posicao, cidade, altura, peso, estatisticas, habilidades, videos, status, contatos)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
    [
      req.user.id,
      nome,
      idade,
      posicao,
      cidade,
      altura,
      peso,
      estatisticas,
      habilidades,
      videos,
      status,
      contatos,
    ]
  );

  return res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, requireRole(["athlete"]), async (req, res) => {
  const {
    nome,
    idade,
    posicao,
    cidade,
    altura,
    peso,
    estatisticas,
    habilidades,
    videos,
    status,
    contatos,
  } = req.body;

  const result = await query(
    `UPDATE athletes
      SET nome = $1,
          idade = $2,
          posicao = $3,
          cidade = $4,
          altura = $5,
          peso = $6,
          estatisticas = $7,
          habilidades = $8,
          videos = $9,
          status = $10,
          contatos = $11
      WHERE id = $12 AND user_id = $13
      RETURNING *`,
    [
      nome,
      idade,
      posicao,
      cidade,
      altura,
      peso,
      estatisticas,
      habilidades,
      videos,
      status,
      contatos,
      req.params.id,
      req.user.id,
    ]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Atleta não encontrado ou sem permissão." });
  }

  return res.json(result.rows[0]);
});

export default router;
