var mod = module.exports;

mod.init = init;
mod.getAllPlaces = getAllPlaces;
mod.getPlacesByName = getPlacesByName;

/////////////

var model = require("./places");

function init(app) {
	require("./api").init(app);
}

async function getPlacesByName() {
    var r = await model.getPlacesByName()
	return r;
}

async function getAllPlaces() {
    var r = await model.getAllPlaces();
    //console.log('returned from places.js:', r);
	return r;
}