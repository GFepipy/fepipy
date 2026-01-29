import bcrypt from "bcryptjs";
import { withClient } from "./db.js";

const seed = async () => {
  await withClient(async (client) => {
    await client.query("BEGIN");
    await client.query("TRUNCATE applications, events, athletes, users RESTART IDENTITY CASCADE");

    const athletePass = await bcrypt.hash("senha123", 10);
    const organizerPass = await bcrypt.hash("senha123", 10);

    const athleteUser = await client.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1,$2,'athlete') RETURNING id",
      ["atleta@demo.com", athletePass]
    );

    const organizerUser = await client.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1,$2,'organizer') RETURNING id",
      ["clube@demo.com", organizerPass]
    );

    await client.query(
      `INSERT INTO athletes
        (user_id, nome, idade, posicao, cidade, altura, peso, estatisticas, habilidades, videos, status, contatos)
       VALUES
        ($1, 'Ana Souza', 22, 'Atacante', 'São Paulo', 1.72, 62, '{"gols":12,"assistencias":7}', '{"chute":"avançado","velocidade":"alta"}', '["https://youtube.com/demo1"]', 'disponível', '{"whatsapp":"+55 11 90000-0000"}')`,
      [athleteUser.rows[0].id]
    );

    await client.query(
      `INSERT INTO events
        (organizer_id, titulo, descricao, data_evento, local, requisitos)
       VALUES
        ($1, 'Peneira Nacional', 'Avaliação de atletas sub-23', '2025-03-15', 'Rio de Janeiro', 'Sub-23, nível competitivo')`,
      [organizerUser.rows[0].id]
    );

    await client.query("COMMIT");
  });
};

seed()
  .then(() => {
    console.log("Seed concluído.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
