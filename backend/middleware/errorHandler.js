export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server Error",
  });
};
