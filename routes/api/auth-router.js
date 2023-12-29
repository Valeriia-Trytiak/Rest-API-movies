//група маршрутів, що стосується авторизації
import express from "express";

import { isEmplyBody, isValidId } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const authRouter = express.Router();

export default authRouter;
