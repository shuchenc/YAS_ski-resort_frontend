module.exports.init = function(app) {
    app.get("/places", getAllPlaces); 
}

///////////////

var manager = require("./index");

async function getAllPlaces(req, res, next) {
    try {
        req.response = await manager.getAllPlaces();
        next();
    } catch(e) {
        req.error = e;
        next();
    }
}
