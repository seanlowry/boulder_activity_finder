var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto')
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var pgp = require('pg-promise')();

// If running into errors here, try:
// docker-compose down
// docker volume ls
// docker volume rm (whatever volume is being used for the site currently; probably 'components_labwebsite-db')
// docker-compose up
// This will reinitialize the database and store the future volumes in components_db_volumes

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));

app.get('/',function(req, res){
  res.render('pages/login',{
      my_title: "Login",
			alert_msg: ''
  });
});

app.post('/login',function(req, res){
	var input = req.body.inputIdentifier;
	var pass = req.body.inputPassword;
	var checkUserExists = `SELECT count(*) FROM users WHERE email = '${input}' or username = '${input}';`;
	db.any(checkUserExists)
		.then(function(data){
			if (data[0].count == '1') {
				var grabPassword = `SELECT user_password FROM users WHERE email = '${input}' or username = '${input}';`;
				db.any(grabPassword)
				 .then(data1 => {
					 if(data1[0].user_password == pass) {
						 var getUserInfo = `select user_id, firstname, username from users where username = '${input}' or email = '${input}';`;
						 db.any(getUserInfo)
							 .then(data2 => {
								 res.cookie("account", {userid: data2[0].user_id, firstname: data2[0].firstname, username: data2[0].username}, {maxAge: 60000})
								 res.redirect('/home')
							 })
							 .catch (err => {
								 console.log('ERROR:' + err);
								 res.render('pages/error', {
		 							my_title: 'Error',
									alert_msg: "We're sorry; something has gone terribly wrong on our end."
		 						})
							 })
					 }
					 else {
						 res.render('pages/error', {
							my_title: 'Error',
							alert_msg: "Incorrect Password."
						})
					 }
					})
			}
			else {
				res.render('pages/error', {
				 my_title: 'Error',
				 alert_msg: "Username/Email does not exist."
			 })
			}
		})
		.catch (err => {
			console.log('ERROR:' + err);
			res.render('pages/error', {
				my_title: 'Error',
				alert_msg: "We're sorry; something has gone terribly wrong on our end."
			})
		})
});

function hashfunc(useremail, pwd){
    var hash = crypto.createHash('md5')
    hash.update(useremail + pwd)
    //console.log(hash.digest('hex'))
    return hash.digest('hex')
}

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
			res.render('pages/error', {
				my_title: 'Error',
				alert_msg: "We're sorry; something has gone terribly wrong on our end."
			})
		})
});

app.post('/registration/new_user', (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var validateEmail = `select count(*) from users where email= '${email}';`;
	var validateUsername = `select count(*) from users where username= '${username}';`;
	var existing_users = 'select username from users;';
	db.task('get-everything', task => {
		return task.batch([
			task.one(validateEmail),
			task.one(validateUsername),
			task.any(existing_users)
		]);
	})
		.then(data => {
			if (data[0].count != '0') {
				res.render('pages/error', {
					my_title: 'Error',
					alert_msg: "The email you entered appears to already be in use."
				})
			}
			else if (data[1].count != '0') {
				res.render('pages/error', {
					my_title: 'Error',
					alert_msg: "The username you entered appears to already be in use."
				})
			}
			else {
				var firstname = req.body.firstname;
				var lastname = req.body.lastname;
				var password = req.body.password;
					//password = hashfunc(email, password) //encryption for password
				var createUser = `insert into users (firstname, lastname, username, email, user_password) values ('${firstname}','${lastname}','${username}','${email}','${password}');`;
				var getUserId = `select user_id from users where username = '${username}';`;
				db.task('get-everything', task => {
					return task.batch([
						task.any(createUser),
						task.one(getUserId)
					]);
				})
					.then(data1 => {
						res.cookie("account", {userid: data1[1].user_id, username: username, email: email, pwd: password}, {maxAge: 60000})
						res.redirect('/home')
					})
					.catch(err => {
						console.log('ERROR:' + err);
						res.render('pages/error', {
							my_title: 'Error',
							alert_msg: "We're sorry; something has gone terribly wrong on our end."
						})
					})
			}
		})
		.catch(err => {
			console.log('ERROR:' + err);
			res.render('pages/error', {
				my_title: 'Error',
				alert_msg: "We're sorry; something has gone terribly wrong on our end."
			})
		})
});


app.get('/home',function(req, res){
	var currUser = req.cookies["account"];
  if(currUser){
    id = currUser.userid
    var pullActivities = `SELECT * FROM activities;`;
		var pullPosts= `select * from posts;`;
    db.task('get-everything', task => {
			return task.batch([
				task.any(pullActivities),
				task.any(pullPosts)
			]);
		})
	    .then(function(data){
				console.log("Activities\n"+data)
				console.log("Posts\n"+data[1])
	      res.render('pages/home',{
	          my_title: 'Home',
						activities: data[0],
						posts: data[1],
						alert_msg: '',
	          joinpost: data
	      })
	    })
			.catch (err => {
				console.log('ERROR:' + err);
				res.render('pages/db_error', {
					my_title: 'Error',
					alert_msg: 'Communication Error'
				})
			})
  }
	else {
    res.render('pages/login',{
      my_title: 'Login',
			alert_msg: '',
    })
  }
});

app.get('/public_post',function(req, res){
    //var author_id =  req.body

    var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
    db.any(query)
        .then(function(data){
            //console.log(data);
            res.render('pages/post',{
                my_title: 'Home',
								alert_msg: '',
                allpost: data
            })
        })
        .catch(error =>{
            console.log("Error", error)
						res.render('pages/error', {
							my_title: 'Error',
							alert_msg: "We're sorry; something has gone terribly wrong on our end."
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
                my_title: 'home',
								alert_msg: '',
                allpost: data[1]
            })
        })
        .catch(error =>{
					res.render('pages/error', {
						my_title: 'Error',
						alert_msg: "We're sorry; something has gone terribly wrong on our end."
					})
        })
});

app.listen(3000);
console.log('3000 is the magic port');
