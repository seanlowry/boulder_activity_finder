var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto')
var cookieParser = require('cookie-parser');
const { join } = require("path");
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

app.get('/home',function(req, res){
	var currUser = req.cookies["account"];
  if(currUser){
    id = currUser.userid
    var pullActivities = `SELECT * FROM activities WHERE;`;
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


app.get('/new_post', function(req, res){
    res.render('pages/post',{
        my_title: "new post",
        alert_msg: ''
    })
})

app.post('/new_post/annou', function(req,res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        console.log("annou", req.body)
        var title = "'" + req.body.new_title + "'"
        var summary = "'" + req.body.new_summary + "'"
        var desc = "'" + req.body.new_desc + "'"
        var query1 = "INSERT INTO posts(author_id,title, summary, full_desc)VALUES("+id +","+ title + ","+ summary + "," + desc+");"
        db.any(query1)
            .then(function(data){
                console.log("announcement successed\n")
                res.render('pages/post',{
                    title: "post/annou",
                    alert_msg: "",

                })
            })
            .catch(error  =>{
                console.log("announcement failed\n")
                res.render('pages/post',{
                    title: "post/annou",
                    alert_msg: error,
                    error: error
                })
            })

    }
})

app.post('/new_post/activity', function(req,res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        console.log("annou", req.body)
        var title = "'" + req.body.new_title + "'"
        var summary = "'" + req.body.new_summary + "'"
        var desc = "'" + req.body.new_desc + "'"
        var time = "'" + req.body.new_time + ":00'"
        var date = "'" + req.body.new_date + "'"
        console.log(time)
        console.log(date)
        console.log(title)
        console.log(summary)
        var query1 = "INSERT INTO activities(manager_id,title, activity_date, activity_time, description)VALUES("+id +","+ title + ","+ date + "," + time + "," + desc+");"
        db.any(query1)
            .then(function(data){
                console.log("aactivity successed\n")
                res.render('pages/post',{
                    title: "post/acitity",
                    alert_msg: "",

                })
            })
            .catch(error  =>{
                console.log("activity failed\n")
                res.render('pages/post',{
                    title: "post/activity",
                    alert_msg: error,
                    error: error
                })
            })

    }

})

app.get('/public_post',function(req, res){
    //var author_id =  req.body
    if(req.cookies["account"] !=null){

        var query1 = "SELECT * FROM posts ORDER BY post_id desc limit 4;"
        var query2 = "SELECT * FROM activities ORDER BY activity_id desc limit 4;"
        db.task('get-everything', task=>{
            return task.batch([
                task.any(query1),
                task.any(query2)
            ]);
        })
            .then(function(data){
                
                res.render('pages/browse',{
                    my_title: 'Home',
                    alert_msg: '',
                    allpost: data[0],
                    allactivity: data[1]
                })
            })
            .catch(error =>{
                console.log("fail")
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: 'Home',
                                    alert_msg: '',
                    allpost: ''
                })

            })
    }else{
        res.redirect('/')
    }
});


app.post('/public_post/join_0',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        var join_id = req.body.activity_id
        console.log("activity_id", req.body)
        
        console.log(req.body)
        var query1 = "UPDATE activities SET integer_array = array_append(integer_array, 5) WHERE activity_id = " + join_id +"; "
        console.log(query1)
        
        db.any(query1)
            .then(function(data){
                //console.log(data);
                res.redirect('/public_post')
            })
            .catch(error =>{
                
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: '\public_post',
                    alert_msg: 'join failed',
                    
                })

            })
            
        res.redirect('/public_post')
    }

});

app.post('/public_post/join_1',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        var join_id = req.body.activity_id
        console.log("activity_id", req.body)
        
        console.log(req.body)
        var query1 = "UPDATE activities SET integer_array = array_append(integer_array, 5) WHERE activity_id = " + join_id +"; "
        console.log(query1)
        
        db.any(query1)
            .then(function(data){
                //console.log(data);
                res.redirect('/public_post')
            })
            .catch(error =>{
                
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: '\public_post',
                    alert_msg: 'join failed',
                    
                })

            })
            
        res.redirect('/public_post')
    }

});

app.post('/public_post/join_2',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        var join_id = req.body.activity_id
        console.log("activity_id", req.body)
        
        console.log(req.body)
        var query1 = "UPDATE activities SET integer_array = array_append(integer_array, 5) WHERE activity_id = " + join_id +"; "
        console.log(query1)
        
        db.any(query1)
            .then(function(data){
                //console.log(data);
                res.redirect('/public_post')
            })
            .catch(error =>{
                
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: '\public_post',
                    alert_msg: 'join failed',
                    
                })

            })
            
        res.redirect('/public_post')
    }

});

app.post('/public_post/join_3',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        var join_id = req.body.activity_id
        console.log("activity_id", req.body)
        
        console.log(req.body)
        var query1 = "UPDATE activities SET integer_array = array_append(integer_array, 5) WHERE activity_id = " + join_id +"; "
        console.log(query1)
        
        db.any(query1)
            .then(function(data){
                //console.log(data);
                res.redirect('/public_post')
            })
            .catch(error =>{
                
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: '\public_post',
                    alert_msg: 'join failed',
                    
                })

            })
            
        res.redirect('/public_post')
    }

});



app.post('/public_post',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        var comment = req.body.comment
        var ids = req.body.Id
        var temp_arr = ids.split('&') //[posy_id & author_id]
        console.log(req.body)
        var query1 = "INSERT INTO comments(post_id, author_id,commentee_ids, body)VALUES("+parseInt(temp_arr[0])+","+parseInt(temp_arr[1])+"," + id+",'"+comment+"');"
        console.log(query1)
        var query2 = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
        db.any(query1)
            .then(function(data){
                //console.log(data);
                res.redirect('/public_post')
            })
            .catch(error =>{
                console.log("fail")
                console.log("Error", error)
                res.render('pages/browse',{
                    my_title: 'home',
                    alert_msg: 'comment failed',
                    allpost: ''
                })

            })
    }

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

//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
