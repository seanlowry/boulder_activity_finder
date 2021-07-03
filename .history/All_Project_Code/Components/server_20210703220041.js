var express = require("express")
var app = express()
//var bodyParser = require("body_parse")
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))

var pgp = require('pg-promise')();

app.get('/',function(req, res){
    res.render('pages/login.html',{
        
    });
});

app.listen(3000);
console.log('3000 is the magic port');
