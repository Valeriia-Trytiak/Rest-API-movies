//група маршрутів, що стосується авторизації
import express from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmplyBody, authenticate } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userSigninSchema, userSignupSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmplyBody, validateBody(userSignupSchema), authController.signup); //маршрут регєєстрації користувача, робимо 2 перевірки - що тіло не пусте та перевірити чи відповідає тіло запиту схемі джой
authRouter.post("/signin", isEmplyBody, validateBody(userSigninSchema), authController.signin);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/signout", authenticate, authController.signout);
export default authRouter;
