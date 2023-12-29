import app from "./app.js";
import mongoose from "mongoose";
// import { DB_HOST } from "./config.js";

// console.log(process.env); //глобальный объект нод джс в котором хранится вся информация о настройках хостинга

const { DB_HOST, PORT = 3000 } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1); //закрівает все запущеннііе фоновіе процессі
  });

/*
  1. убрать конд данные с гит хаба
  2. настроить переменные окружения на рендер.ком через enviroment: POST-300; DB_HOST - mongodb+srv://Valeriia:flXbmyZEsfSMVUDJ@cluster0.shkaxtw.mongodb.net/my-movies?retryWrites=true&w=majority
  3. настроить хостинг на компьютере: установить dotenv, создать текстовый файл .env и перенести туда секретніе данные (DB_HOST POST), передать данны из файла в процесс.энв(см app.js), создать файл .env.example и перенести туда названия ключей без значений   */
