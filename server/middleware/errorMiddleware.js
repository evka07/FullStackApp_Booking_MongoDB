function errorHandler (err, req, res, next) {
    const statusCode = err.statusCode || 500;

    const response = {
        message: err.message,
    }

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);

}

function notFound(req, res, next) {
    const error = new Error(`Not Found — ${req.originalUrl}`);
    error.statusCode = 404;
    next(error); // передаем ошибку дальше в errorHandler
}

module.exports = { notFound, errorHandler };
