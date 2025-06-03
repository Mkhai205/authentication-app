/**
 * @description: Middleware to handle errors in the application.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    // check if response headers have already been sent to the client
    if (res.headersSent) {
        // If true, pass the error to the next error handler middleware
        return next(err);
    }

    // log error stack trace to the console for debugging if not in production
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    // set the status code based on the error type
    const statusCode = err?.statusCode >= 400 ? err.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorHandler;
