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

// 查询
db.connect(function(err, client, done) {
    if(err) {
      return console.error('数据库连接出错', err);
    }
    // 简单输出个 Hello World
    client.query('SELECT $1::varchar AS OUT', ["Hello World"], function(err, result) {
      done();// 释放连接（将其返回给连接池）
      if(err) {
        return console.error('查询出错', err);
      }
      console.log(result.rows[0].out); //output: Hello World
    });
  });
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
    var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.any(query)
        .then(function(data){
            console.log(data);
            all_post = data;
        })
        .catch(error =>{
            res.render('pages/home',{
                
            })
            console.log("Errpr", error)
        })
    res.render('pages/home',{
        my_title: ""
    });
});


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
