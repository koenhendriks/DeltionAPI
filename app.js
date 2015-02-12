var express = require('express');
var app = express();
var DeltionAPI = require('./DeltionAPI');

/**
 * department route
 */
app.get('/departments', function (req, res) {
    DeltionAPI.getDepartments(function(departments){
        console.log(departments);
        res.send('success, see console');
    });
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