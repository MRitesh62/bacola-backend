export const err = (res, statusCode, message) => {
    res.status(statusCode).json({
        message:message,
        success: false
    });
};