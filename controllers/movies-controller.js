import fs from "fs/promises";
import path from "path";
import Movie from "../models/Movie.js";
//все динамические части маршрута находятся в объекте req.params
//тело запроса находится в req.body
// здесь лежат контраллеры обработки запросов (саму с массивом данных импортирую из другого файла) - здесь проверка значений и валидация ошибок

import { HttpError } from "../helpers/index.js";
import { ctrWrapper } from "../decorators/index.js";
import User from "../models/User.js";

//создаем новый путь к папке хранения постеров:
const posterPath = path.resolve("public", "posters");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query; // параметры запроса (после ?) находятся в объекте query
  const skip = (page - 1) * limit;
  const result = await Movie.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "username"); //третий аргумент - доп параметры запроса. За пагинацию отвечают skip - сколько пропустить объектов в базе, limit - скользо взять из базы. Populate - позволяет расширитт запрос: первым аргументом предаем поле, которое нужно расширить - он идет в коллекцию, которая указана в ref (см. монгуз схему) и по айди ижет объект юзера и вставляет этот объект на место айди
  res.json(result);
  //если передадим в next error он пойдет искать мидлвар в который передано 4 аргумента: app.use((err, req, res, next)
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await User.findOne({ _id, owner });

  if (!result) {
    throw HttpError(404, `Movie with id=${id} not found`); // если фильм с таким айди не найдем, возвращается нал
    //   const error = new Error(`Movie with id=${id} not found`);
    //   error.status = 404;
    //   throw error;
    //   return res.status(404).json({
    //     message: `Movie with id=${id} not found`,
    //   });
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file; //берем полный путь к файлу включая его имя(старый путь)
  const newPath = path.join(posterPath, filename); // отвечает за объединения пути - правильно расставляет слеши
  await fs.rename(oldPath, newPath); //ренейм отвечает за перемещение файла
  const poster = path.join("posters", filename); //относительній путь к файлу
  const result = await Movie.create(...req.body, poster, owner);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Movie.findOneAndUpdate({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Movie with id=${id} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Movie.findOneAndDelete({ _id, owner });
  if (!result) {
    throw HttpError(404, `Movie with id=${id} not found`);
  }
  res.json(result); // res.json({message: "Delete success"})  // res.status(204).send()
};
export default {
  getAll: ctrWrapper(getAll),
  getById: ctrWrapper(getById),
  add: ctrWrapper(add),
  updateById: ctrWrapper(updateById),
  deleteById: ctrWrapper(deleteById),
};
