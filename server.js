var express = require('express');
var watson = require('watson-developer-cloud');
var xmlParser = require('xml2js');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(session({ secret: getSessionSecret() }));
app.use(bodyParser());
app.use(cookieParser());
var chatbot = require(__dirname + '/chatbot/chatbot.js');

app.get("/", function (req, res) {
    if (req.session != null && req.session.email != null && req.session.name != null)
        res.redirect("/bookTest");
    else
        res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", function (req, res) {
    req.session.name = req.body.name;
    req.session.email = req.body.email;
    res.redirect("/bookTest");
})

app.get("/bookTest", function (req, res) {
    if (req.session != null && req.session.email != null && req.session.name != null)
        res.sendFile(__dirname + "/public/book-test.html");
    else
        res.redirect("/");
});

app.get("/findDoctor", function (req, res) {
    if (req.session != null && req.session.email != null && req.session.name != null)
        res.sendFile(__dirname + "/public/find-doctor.html");
    else
        res.redirect("/");
});

app.get("/watsonResponse", function (req, res) {
    chatbot.sendMessage(req, res);
});

app.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

function getSessionSecret() {
    return Math.floor(Math.random * 10000000).toString();
}

eventEmitter.on('connection', chatbot.loadConfig);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("NAGP ChatBot listening at http://%s:%s", host, port);
    eventEmitter.emit('connection');
});

