import { Schema, model } from "mongoose";
import { handleSaveError, handleUpdate } from "./hooks.js";
import Joi from "joi";

const genreList = ["fantastic", "love story"];
const releaseYearRegexp = /^\d{4}$/;

// схема колекции(монгус схема), которая хранится в бд
const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false, //если не передали значение устанавливается дэфолтное
    },
    genre: {
      type: String,
      enum: genreList, // если проверка предполагает что будет один вариант из нескольких возможных - в массиве прописуем все возможные варианты
      required: true,
    },
    releaseYear: {
      type: String,
      match: releaseYearRegexp, // если необходимо сделать проверку с регулярным выражением
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
); // первый аргумент - схема валидации того, что сохраняется в БД, второй аргумент - объект настроек (в нашем случае удаляем автоматически созданый ключ версии и добавляем дату создания и дату обновления)

movieSchema.post("save", handleSaveError);
movieSchema.pre("findOneAndUpdate", handleUpdate);
movieSchema.post("findOneAndUpdate", handleSaveError); //операция базы для обновления по айди

//схема валидации запроса на добавлкние контакта
export const movieAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": '"title" must be exist', // кастомніе сообщения об ощибках
  }),
  director: Joi.string().required(),
  favorite: Joi.boolean(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  releaseYear: Joi.string().pattern(releaseYearRegexp).required(),
});

//схема валидации запроса на обновление контакта
export const movieUpdateSchema = Joi.object({
  title: Joi.string(),
  director: Joi.string(),
  favorite: Joi.boolean(),
  genre: Joi.string().valid(...genreList),
  releaseYear: Joi.string().pattern(releaseYearRegexp),
});

// схема валидации обновления поля фаворита
export const movieUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Movie = model("movie", movieSchema); //первый аргумент - передаем название коллекции, с которой будет взаимодействовать этот класс в ед.числе , второй аргумент - монгус схема

export default Movie;

//если валидация модели не прошла - модель выбрасывает ошибку, ее подхватывает кэтч некст, но у ошибки нет статуса - нужнот его установить. В этом помогут монгуст хуки (это функции, которые нужно выполнить перед или после какого действия)
