const path = require('path');
module.exports.init = async function(app) {
	//var config = global.configuration;
	app.get("/assets/config.json", extractConfig);
	app.get("/testPage", (req, res) => {
		console.log(req.hostname);
		res.sendFile("test.html", {root: path.join(__dirname, '../test')});
    });
    app.get("/", (req, res) => {
        res.sendFile("index.html", {root: path.join(__dirname, '../public')});
    });
	await initControllers(app);
	await initResponseWrapper(app);
}

/////////////

async function extractConfig(req, res, next) {
	try{
		res.json(configuration);
	} catch(e) {
        req.error = e;
        console.log(e);
		next();
	}
}

async function initControllers(app) {
	var controllersToInit = ["./places"];
	for (c of controllersToInit) {
		await require(c).init(app);
	}
}

async function initResponseWrapper(app) {
	app.use((req, res, next) => {
        // Allow cross origin access
		if (req.method === 'OPTIONS') {
			var headers = {};
			headers["Access-Control-Allow-Origin"] = "*";
			headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, token";
			res.writeHead(200, headers);
			res.end();
			return
		}

		if (req.response) {
			res.send(req.response);
		}
		else if (req.error) {
			res.status(400).send(req.error);
		} 
		else {
			res.status(400).send({
				errcode: "112358",
				message: "Unhandled error"
			});
		}
		res.end();
	});
}