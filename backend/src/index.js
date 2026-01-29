import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import athleteRoutes from "./routes/athletes.js";
import eventRoutes from "./routes/events.js";
import applicationRoutes from "./routes/applications.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", applicationRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
