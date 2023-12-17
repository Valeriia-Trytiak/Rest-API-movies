import * as moviesService from "../models/movies/index.js";
//все динамические части маршрута находятся в объекте req.params
//тело запроса находится в req.body
// здесь лежат контраллеры обработки запросов (саму с массивом данных импортирую из другого файла) - здесь проверка значений и валидация ошибок

import { HttpError } from "../helpers/index.js";
import { movieAddSchema, movieUpdateSchema } from "../schemas/movie-schemas.js";

const getAll = async (req, res, next) => {
  try {
    const result = await moviesService.getAllMovies();
    res.json(result);
  } catch (error) {
    next(error); //если передадим в next error он пойдет искать мидлвар в который передано 4 аргумента: app.use((err, req, res, next)
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await moviesService.getMovieById(id);
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
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { error } = movieAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await moviesService.addMovie(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { error } = movieUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await moviesService.updateMovieById(id, req.body);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await moviesService.deleteById(id);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result); // res.json({message: "Delete success"})  // res.status(204).send()
  } catch (error) {
    next(error);
  }
};
export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
