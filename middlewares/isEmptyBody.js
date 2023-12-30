import { HttpError } from "../helpers/index.js";

const isEmplyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "Body must have fields"));
  }
  next();
};

export default isEmplyBody;
