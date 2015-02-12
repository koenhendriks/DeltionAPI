/**
 * Created by koen on 8-12-14.
 */

var express = require('express');
var path = require('path');
var app = express();

//configure app

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//use middleware
app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/fonts', express.static(__dirname+'/fonts'));

//define routes
app.get('/', function (req, res){
    res.render('index', {
        title: 'Nomvex'
    });
});


app.listen(1337, function (){
    console.log('Ready on port 1337');

});
