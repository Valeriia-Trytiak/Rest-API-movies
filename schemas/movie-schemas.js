import Joi from "joi";

//схема валидации запроса на добавлкние контакта
export const movieAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": '"title" must be exist', // кастомніе сообщения об ощибках
  }),
  director: Joi.string().required(),
});

//схема валидации запроса на обновление контакта
export const movieUpdateSchema = Joi.object({
  title: Joi.string(),
  director: Joi.string(),
});
