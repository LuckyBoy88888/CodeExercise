
// Create express app
var express = require("express")
var cors = require("cors")
const helmet = require('helmet')
var app = express()
var db = require("./database")
var routes = require("./route")

// Server port
var HTTP_PORT = 8010

app.use(cors({ credentials:true, origin: [
    'http://localhost:3001'
] }))
app.use(helmet());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(routes);

// Start server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`)
});

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});
