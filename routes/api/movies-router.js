// создаю путь к запросу, добавляю контролер обработки

import express from "express";

import moviesController from "../../controllers/movies-controller.js";
import { isEmplyBody, isValidId } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { movieAddSchema, movieUpdateSchema, movieUpdateFavoriteSchema } from "../../models/Movie.js";
const moviesRouter = express.Router();

moviesRouter.get("/", moviesController.getAll); //получили запрос, вызвали необходимый метод json(функцию для обработки запроса), отправили ответ - вынесли эту ллогику в отдельную функцию, экспортировали как объект и вызываем методы на нужный запрос

moviesRouter.get("/:id", moviesController.getById);

moviesRouter.post("/", isEmplyBody, validateBody(movieAddSchema), moviesController.add); // добавили мидл вар, который проверяет, что поля не пустые при отправке нового фильма

moviesRouter.put("/:id", isEmplyBody, validateBody(movieUpdateSchema), moviesController.updateById);
moviesRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmplyBody,
  validateBody(movieUpdateFavoriteSchema),
  moviesController.updateById
);

moviesRouter.delete("/:id", moviesController.deleteById);

export default moviesRouter;
