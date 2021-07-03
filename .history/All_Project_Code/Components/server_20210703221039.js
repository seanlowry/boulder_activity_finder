var express = require("express")
var app = express()
//var bodyParser = require("body_parse")
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))

var pgp = require('pg-promise')();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

app.get('/',function(req, res){
    res.render('pages/login.ejs',{
        my_title: "home"
    });
});

app.listen(3000);
console.log('3000 is the magic port');
