import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv"; //import 'dotenv/config' from "dotenv"; - более короткая запись вызова метода конфиг

import moviesRouter from "./routes/api/movies-router.js";
import authRouter from "./routes/api/auth-router.js";

dotenv.config(); // читает файлі проекта, находит файл .env забирает данніе и переносит в глобальній обїект настроек process.env в момент запуска проекта
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(500).json({ message });
});

export default app;
