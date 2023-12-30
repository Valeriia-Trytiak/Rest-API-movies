import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrWrapper } from "../decorators/index.js";
import bcrypt from "bcrypt"; //пакет для хэширования пароля. Методы используются в асинхронных функциях
import jwt from "jsonwebtoken";
import "dotenv/config";

// const { JWS_SECRET } = process.env;
// const payload = {
//   id: "658fac4683ed895c8a9e4d3a",
// };

// const token = jwt.sign(payload, JWS_SECRET, { expiresIn: "23h" }); //Створюємо  токкен. обєкт налаштувать expiresIn - час життя токену. Токен - складна строка, що розділена на три частини комами: перша частина - зашифрований хедер, друга - зашифрований пейлоад, третя - зашифрованая частина - підпис
// const decodeToken = jwt.decode(token); // можливо декодувати токен, не знаючи секретного ключа, тому у пейлоаді не зберігаємо жодних приватних даних (типу паролей чи пошти)
//для визначення валідності токену потрібно:
// try {
//   const jwtPayload = jwt.verify(token, JWS_SECRET); //перевіряє чи дійсно token шифрувався за допомогою JWS_SECRET ключа. Якщо ні - викидає помилку. Якщо так - перевіряє час життя токену - якщо не валідний - теж викидає помилку. ЯЧкщо час життя не закінчився - повертає пейлоад
// } catch (error) {
//   console.log(error.message);
// }
// const hashPassword = async (password) => {
//   // const salt = await bcrypt.genSalt(10); //генерує випадковий набір даних з достатнью складністю. Це 2 число 10 - другий аргумнет у функції хешування
//   const result = await bcrypt.hash(password, 10);
//   const compareResult = await bcrypt.compare(password, result); //метод логанизации пользователя - проверяет есть ли второй аргумент хэштрованной версией первого аргумента, если да - возвращает тру
// };

const { JWS_SECRET } = process.env;
const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //перевфряємо перед створенням користувача чи є такий ємейл у базі
  if (user) {
    throw HttpError(409, "Email alredy in use"); // якщо такий користувач вже є викидаємо помилку
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //перевіряємо чи є користувач з таким email. Якщо знайшов - повертає обєкт юзера з бази даних
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password); //user.password це захешована версія паролю, що зберігається у базі
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWS_SECRET, { expiresIn: "23h" }); //вважається пропуском, що прикріплюється до кожного запиту, щоб не робити аутенфікацію на кожний запит

  res.json({
    token,
  });
};

export default {
  signup: ctrWrapper(signup),
  signin: ctrWrapper(signin),
};
