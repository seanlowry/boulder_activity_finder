var express = require("express")
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var pgp = require('pg-promise')();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

var pgp = require('pg-promise')();

const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'football_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

app.get('/',function(req, res){
    res.render('pages/login.ejs',{
        my_title: ""
    });
});


app.get('/',function(req, res){
    var email = req.query.inputEmail
    var query1 = 'SELECT * FROM users;'
    var query2 = 
    res.render('pages/home.ejs',{

    });
});

app.listen(3000);
console.log('3000 is the magic port');