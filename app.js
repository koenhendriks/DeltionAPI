var express = require('express');
var app = express();
var DeltionAPI = require('./DeltionAPI');

/**
 * department route
 */
app.get('/departments', function (req, res) {
    var html = DeltionAPI.getDepartments();
    console.log(html);
    res.send('html: '+html);
});

/**
 * Index route
 */
app.get('/', function (req, res) {
    res.send('<h2>Deltion Rooster API</h2><p>Version 1.0.0 using NodeJS with Express</p>by <b><a href="http://koenhendriks.com">Koen Hendriks</a><b/>');
});


var server = app.listen(1337, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

});