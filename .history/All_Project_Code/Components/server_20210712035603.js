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
	database: 'postgres',
	user: 'postgres',
	password: 'mysecretpassword',
    max: 20, //maximum connect number
    idleTimeoutMillis:30000, //idle time
};

//var pool = new pgp.pool(dbConfig)


var db = pgp(dbConfig);


app.get('/',function(req, res){
    res.render('pages/login',{
        my_title: ""
    });
});

app.get('/home',function(req, res){
    var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.any(query)
        .then(function(data){
            console.log(data);
            res.render('pages/home',{
                title: 'home',
                allpost: data
            })
        })
        .catch(error =>{
            console.log("fail")
            console.log("Error", error)
            res.render('pages/home',{
                title: 'home',
                allpost: ''
            })
            
        })
    
});

app.get('/post', function(req, res){
    res.render('pages/post',{
        my_title: ""
    });
})


app.post('/login',function(req, res){
    console.log(req.body.inputEmail)
    
    var email = req.body.inputEmail;
    var pass = req.body.inputPassword;
    //console.log(email)
   //console.log(pass)
    var query1 = "SELECT user_password FROM user_details WHERE email = '"+email+"'"
    //console.log(query1)
    db.any(query1)
        .then(function(data){
            console.log(data)
            var data_str = JSON.stringify(data[0].user_password)
            var pass_str = '"' + pass.toString() + '"';
            if(data_str == pass_str){
                res.render('pages/home',{
                    title: "login",
                    log: data
                })
            }else{
                res.render('pages/login',{
                    title: "login",
                    log: ''
                })
            }
            
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
