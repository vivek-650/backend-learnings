const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const status = Number(error.code) || 500;
    res.status(status).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
    next(error);
  }
};
export default asyncHandler;
