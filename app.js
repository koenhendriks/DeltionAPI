var express = require('express');
var path = require('path');
var app = express();
var Departments = require('./libs/Departments');
var Classes = require('./libs/Classes');


/**
 * Main App values
 */
app.title = 'Deltion Rooster API';
app.version = '1.0.0';
app.webUrl = 'http://localhost:1337/';

/**
 * Set view engine
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Set frond-end middle ware
 */
app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/fonts', express.static(__dirname+'/fonts'));
app.use('/cache', express.static(__dirname+'/cache'));

/**
 * Departments route
 */
app.get('/departments', function (req, res) {
    Departments.get(function(departments){
        res.type('application/json');
        res.jsonp(departments);
    });
});

/**
 * Classes route
 */
app.get('/classes/:departmentId?', function (req, res) {
    var departmentId = req.params.departmentId;
    Classes.get(departmentId,function(classes){
        res.type('application/json');
        res.jsonp(classes);
    });
});

/**
 * Index route
 */
app.get('/', function (req, res) {
    res.render('index', {
        title: app.title,
        version: app.version,
        webUrl: app.webUrl
    });
});


var server = app.listen(1337, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log(app.title+'('+app.version+') listening at http://%s:%s', host, port)

});