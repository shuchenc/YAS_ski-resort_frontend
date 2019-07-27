var mod = module.exports;

mod.getAllPlaces = getAllPlaces;
mod.getPlacesByName = getPlacesByName;

/////////////////////


const request = require('request');

async function getAllPlaces() {
    var url = configuration.backend.hostDomain + "places";
    return new Promise((res, rej) => {
        request(url, 
            (err, r, body) => {
                if (!err && r.statusCode == 200) {
                    res(body);
                } else {
                    rej({
                        errcode: "3445",
                        message: body
                    });
                }
            });
    });
}

async function getPlacesByName() {
    request(configuration+"places", (err, res, body) => {
        if (err) { return console.log(err); }
        return res;
    });
}
