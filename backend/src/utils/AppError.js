class AppError extends Error {
  constructor(message, status = 400, detalles = undefined) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { AppError, asyncHandler };
