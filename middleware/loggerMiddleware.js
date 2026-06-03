const loggerMiddleware = (req, res, next) => {

    console.log("==============");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Time:", new Date());

    next();
}

module.exports = loggerMiddleware;