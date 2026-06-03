const errorMiddleware = (error, req, res, next) => {
    console.log(error);

    res.status(500).json({
        message: error.message || "Server error"
    });
};

module.exports = errorMiddleware;