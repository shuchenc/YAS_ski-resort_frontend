module.exports = function (req, res, next) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    } catch (e) {
        req.error = e;
        res.status(401).json({
            message: "Cors access failed to be added to header."
        })
        next();
    }
}