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

const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'activity_finder_db',
	user: 'postgres',
	password: 'mysecretpassword'
};

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


app.get('/',function(req, res){
    res.render('pages/login',{
        my_title: "Login",
		alert_msg: ''
    });
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
        var time = req.body.new_time
        var date = req.body.new_date
        console.log(time)
        console.log(date)
        console.log(title)
        console.log(summary)
        
        
        var query1 = "INSERT INTO activities(author_id,title, summary, full_desc)VALUES("+id +","+ title + ","+ summary + "," + desc+");"
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

app.get('/home',function(req, res){
    if(req.cookies["account"] !=null){
        var account = req.cookies["account"]
        email = account.account
        pwd = account.pwd
        id = account.userid
        console.log("res.cookie", res.cookies)
        console.log("req.cookies", req.cookies);
        var query = "SELECT *  FROM activities WHERE '"+ id +"'=ANY(member_ids);"
        db.any(query)
            .then(function(data){
                console.log(data);
                res.render('pages/home',{
                    my_title: 'Home',
					alert_msg: '',
                    joinpost: data
                })
                
            })
            .catch(error =>{
                console.log("fail")
                console.log("Error", error)
                res.render('pages/home',{
                    my_title: 'Home',
					alert_msg: error,
                    joinpost: ''
                })

            })
    }else{
        res.render('pages/login',{
            my_title: 'Login',
						alert_msg: '',
            joinpost: ''
        })
    }


});

app.get('/public_post',function(req, res){
    //var author_id =  req.body
    if(req.cookies["account"] !=null){
         
        var query = "SELECT * FROM posts ORDER BY post_id desc limit 5;"
        db.any(query)
            .then(function(data){
                //console.log(data);
                res.render('pages/browse',{
                    my_title: 'Home',
                                    alert_msg: '',
                    allpost: data
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


app.post('/',function(req, res){
    var input = req.body.inputIdentifier;
	console.log(req.body.inputIdentifier)
    var pass = req.body.inputPassword;
    //console.log(email)
    //console.log(pass)
    var query1 = `SELECT user_password FROM users WHERE email = '${input}' or username = '${input}'`;
    //console.log(query1)
    db.any(query1)
        .then(function(data){
            //console.log(data)
            //user_password = data[0].user_password
           // console.log(hashfunc(email, pass));
            var data_str = JSON.stringify(data[0].user_password)
            var pass_str = '"' + pass.toString() + '"';

            if(data_str == pass_str){
                /*
                res.render('pages/home',{
                    title: "home",
                    log: data
                })
                */
								var query2 = `select user_id, username, email from users where username = '${input}' or email = '${input}';`;
								db.any(query2)
									.then(data2 => {
										res.cookie("account", {userid: data2[0].user_id, username: data2[0].user_id, email: data2[0].email, pwd: pass}, {maxAge: 60000})
										res.redirect('/home')
									})
									.catch (err => {
										console.log('ERROR:' + err);
										res.render('pages/db_error', {
											my_title: 'Error',
											alert_msg: 'Communication Error'
										})
									})

            }else{
                res.render('pages/login',{
                    my_title: "Login",
					alert_msg: 'Invalid login credentials.',
                    log: ''
                })
            }

        })
        .catch(error =>{
            //request.flash(("error", error));
            res.render('pages/login',{
                my_title: "Home",
				alert_msg: '',

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
			res.render('pages/db_error', {
				my_title: 'Error',
				alert_msg: 'Communication Error'
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
				res.render('pages/invalid_entry', {
					my_title: 'Error',
					alert_msg: 'The email that you entered is already in use.'
				})
			}
			else if (data[1].count != '0') {
				res.render('pages/invalid_entry', {
					my_title: 'Error',
					alert_msg: 'The username that you entered is already in use.'
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
						res.render('pages/db_error', {
							my_title: 'Error',
							alert_msg: 'Communication Error.'
						})
					})
			}
		})
		.catch(err => {
			console.log('ERROR:' + err);
			res.render('pages/db_error', {
				my_title: 'Error',
				alert_msg: 'Communication Error.'
			})
		})
});

app.listen(3000);
console.log('3000 is the magic port');
