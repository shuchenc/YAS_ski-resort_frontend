// Read configuration
const fs = require('fs');
const path = require('path');
global.configuration = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
configuration.root = __dirname;


// Start http server
var express = require('express'),
    app = express(),
    port = process.env.PORT || configuration.server.port,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: false
}));
app.use(bodyParser.json({
    limit: '5mb',
}));

app.use('/static', express.static(path.join(__dirname, 'public')))

var allowCorsMiddleware = require("./app/middleware/allowCors");
app.use(allowCorsMiddleware);


require("./app").init(app)
.then(() => app.listen(port))
.then(() => console.log("YAS Ski resort frontend started on port: ", port))
.catch(e => console.log("YAS Ski resort frontend initiation failed with error: ", e));


module.exports = app;
