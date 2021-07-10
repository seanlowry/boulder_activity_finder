var express = require("express")
var app = express()
var bodyParser = require('body-parser')
const { request, response } = require("express")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var pgp = require('pg-promise')();

// set the view engine to ejs
app.set('view engine', 'ejs');
//app.set('views', __dirname + '/');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

var pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'postgre',
	user: 'postgres',
	password: 'admin'
};

var db = pgp(dbConfig);
/*
db.one("SELECT * FROM users;",  123)
    .then(use =>{
        console.log("db");
    })
    .catch(err =>{
        console.log("error");
    })
*/
app.get('/',function(req, res){
    res.render('pages/login',{
        my_title: ""
    });
});

app.get('/home',function(req, res){
    res.render('pages/home',{
        my_title: ""
    });
});


app.post('/login',function(req, res){
    console.log(req.body.inputEmail)
    
    var email = req.body.inputEmail;
    var pass = req.body.inputPassword;
    console.log(email)
    console.log(pass)
    var query1 = 'SELECT * FROM users;'
    db.any(query1)
        .then(function(data){
            console.log(data)
            res.render('pages/home',{
                title: "login",
                log: data
            })
        })
        .catch(error =>{
            //request.flash(("error", error));
            res.render('pages/login',{
                title: "login",
                
            })
            console.log("error: ", error)
        });
        
});

app.listen(3000);
console.log('3000 is the magic port');
