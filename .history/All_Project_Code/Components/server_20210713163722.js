var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var pgp = require('pg-promise')();
/*
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'activity_finder_db',
	user: 'postgres',
	password: 'pwd'
};
*/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'mysecretpassword'
};

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


app.get('/',function(req, res){
    res.render('pages/login',{
        my_title: ""
    });
});

app.get('/home',function(req, res){
    console.log("cookie", res.cookie)
    var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.any(query)
        .then(function(data){
            //console.log(data);
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

app.get('/public_post',function(req, res){
    //var author_id =  req.body

    var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.any(query)
        .then(function(data){
            //console.log(data);
            res.render('pages/post',{
                title: 'home',
                allpost: data
            })
        })
        .catch(error =>{
            console.log("fail")
            console.log("Error", error)
            res.render('pages/post',{
                title: 'home',
                allpost: ''
            })

        })

});


app.post('/public_post',function(req, res){
    var comment = req.body.comment
    var ids = req.body.Id
    var temp_arr = ids.split('&') //[posy_id & author_id]
   //console.log(comment)
   // console.log(ids)
    //console.log(temp_arr)
    //console.log(req.body)//console.log("comment:", comment)
    var query1 = "INSERT INTO comments(post_id, author_id, body)VALUES('"+parseInt(temp_arr[0])+"','"+parseInt(temp_arr[1])+"','"+comment+"');"
    var query2 = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.task('get-everything', task=>{
        return task.batch([
            task.any(query1),
            task.any(query2)
        ])
    })
        .then(function(data){
            //console.log(data);
            res.render('pages/post',{
                title: 'home',
                allpost: data[1]
            })
        })
        .catch(error =>{
            console.log("fail")
            console.log("Error", error)
            res.render('pages/post',{
                title: 'home',
                allpost: ''
            })

        })

});


app.post('/',function(req, res){
    console.log(req.body.inputEmail)

    var email = req.body.inputEmail;
    var pass = req.body.inputPassword;
    //console.log(email)
   //console.log(pass)
    var query1 = "SELECT user_password FROM users WHERE email = '"+email+"'"
    //console.log(query1)
    db.any(query1)
        .then(function(data){
            //console.log(data)
            var data_str = JSON.stringify(data[0].user_password)
            var pass_str = '"' + pass.toString() + '"';
            res.setHeader('Set-Cookie',`sign_in_email=${email}`)
            console.log(res)
            if(data_str == pass_str){
                res.render('pages/home',{
                    title: "home",
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
                title: "home",

            })
            console.log("error: ", error)
        });

});


app.get('/registration', (req, res) => {
	var existing_users = 'select username from users;';
	db.any(existing_users)
		.then(data => {
			res.render("pages/registration", {
				my_title: 'Register',
				existing_users: data,
				alert_msg: ''
			})
		})
		.catch (err => {
			console.log('ERROR:' + err);
			res.render('pages/login', {
				my_title: 'registration',
				alert_msg: ''
			})
		})
});


app.post('/registration/new_user', (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var validateUserInfo = `select username, email from users where username= '${username}' or email= '${email}';`;
	db.one(validateUserInfo)
		.catch(err => {
			console.log('ERROR:' + err);
			res.render('pages/login', {
				my_title: 'Login',
				alert_msg: 'Error registering new user.'
			})
		})
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var password = req.body.password;
	var createUser = `insert into users (firstname, lastname, username, email, user_password) values ('${firstname}','${lastname}','${username}','${email}','${password}');`;
	var getUserId = `select user_id from users where username = '${username}';`;
	db.task('get-everything', task => {
		task.any(createUser),
		task.one(getUserId)
	})
		.then(data => {
			res.render('pages/home', {
				my_title: 'Home',
				alert_msg: ''
			})
		})
		.catch(err => {
			console.log('ERROR:' + err);
			res.render('pages/login', {
				my_title: 'Login',
				alert_msg: 'Error registering new user.'
			})
		})
});


app.listen(3000);
console.log('3000 is the magic port');