const ctrWrapper = (ctr) => {
  const func = async (req, res, next) => {
    try {
      await ctr(req, res, next);
    } catch (error) {
      next();
    }
  };
  return func;
};

export default ctrWrapper;

// декоратор это функция, которая принимает в качестве аргумента функцию и возврещает вызов этой функции в обертке другой функции
