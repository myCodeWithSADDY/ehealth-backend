const TryCatch = (passedfunc) => async (req, res, next) => {
  try {
    await passedfunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ErrorHandler, TryCatch };
