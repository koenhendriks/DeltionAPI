var express = require('express');
var path = require('path');
var app = express();
var DeltionAPI = require('./DeltionAPI');


/**
 * Main App values
 */
app.title = 'Deltion Rooster API';
app.version = '1.0.0';

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

/**
 * department route
 */
app.get('/departments', function (req, res) {
    DeltionAPI.getDepartments(function(departments){
        res.type('application/json');
        res.jsonp(departments)
    });
});

/**
 * Index route
 */
app.get('/', function (req, res) {
    res.render('index', {
        title: app.title,
        version: app.version
    });
});


var server = app.listen(1337, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log(app.title+'('+app.version+') listening at http://%s:%s', host, port)

});