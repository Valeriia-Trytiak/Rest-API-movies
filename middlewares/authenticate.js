import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;
const authenticate = async (req, res, next) => {
  const { authorization } = req.headers; //забираем заголовок из запроса и дальше делаем проверку существует ли он
  if (!authorization) {
    return next(HttpError(401, "Authorization not define")); //некст не прерівает віполнение функции, не забіть ретерн
  }
  const [bearer, token] = authorization.split(" "); // нужно проверить, что в заголовке первое слово - bearer, а второе - валидный токен. Используем метод строк сплит и деструктуризацию массива
  if (bearer !== "Bearer") {
    return next(HttpError(401)); //сообщение об ошибке, что в заголовке нет слова Bearer
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET); // если токен валидный, он выбрамывает пейлоад и нужно проверить существует ли пользователь с таким айди
    const user = await User.findById(id);
    if (!user || !user.token || token !== user.token) {
      return next(HttpError(401)); //если юзера нет с таким айди, передаем ошибку, если есть - некст
    }
    req.user = user; // записали в объект ответа всю информаци. про пользователя, что деалет запрос.
    next();
  } catch (error) {
    next(HttpError(401, error.message)); //сюда выкидывает ошибку если не валидный токен (не был зафиврован с помощью нашей строки или если время жизни  токена закончилось)
  }
};

export default authenticate;
