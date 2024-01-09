import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("upload"); // разолв подставляет абсолютный путь к проекту и объединяет части пути, которые передали

const storage = multer.diskStorage({
  destination, //путь к папке, где временно будут храниться файлы
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    callback(null, filename);
  }, //эта настройка для возможности переименования файла при сохранении
}); // настройка пропусти

const limits = {
  fileSize: 1024 * 1024 * 5, //максимальный размер 5 мегабайт
};

const fileFilter = (req, file, callback) => {
  const extention = req.originalname.split(". ").pop(); // разделили имя на слова по точке и вірезаем последнее слово (расширение)
  if (extention === "exe") {
    callback(HttpError(400, ".exe not valid extention"));
  }
}; // настройка допустиміх файлов

const upload = multer({ storage, limits, fileFilter });

export default upload;
