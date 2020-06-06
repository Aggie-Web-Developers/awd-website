var express        = require('express'),
    session       = require('express-session'),
	app            = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	sql            = require('mssql'),
	email          = require('./email/email'),
	bcrypt         = require('bcrypt'),
	initPassport   = require('./passport-config'),
	passport       = require('passport'),
	flash          =require('express-flash');

initPassport(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var config = {
	server: process.env.DB_SERVER,
	port: 1433,
	user: "sa",
	password: process.env.DB_PASSWORD,
	database: "awd-site-dev",
	stream: false,
	options: {
		enableArithAbort: true,
		encrypt: false
	},
	pool: {
		max: 20,
		min: 0,
		idleTimeoutMillis: 30000
	}
};

sql.connect(config).then(pool => {
	if (pool.connected){
		console.log("Connecting to database: [OK]");
	}

	return pool;
}).catch(function(err) {
	console.log("Connecting to database: [FAILED]");
	console.log(err);
});

app.get("/", function(req, res){
	res.render("index");
});

// handle email list signup from index page
app.post("/", function(req, res){
	var email = req.body.txtEmail;
	var sqlReq = new sql.Request();

	sqlReq.input("email", sql.NVarChar, email);

	var queryText = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
					"BEGIN " + 
					"INSERT INTO tbl_email_list (email) values (@email) " +
					"END";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send();
		} else if (req.body.chkNewsGen !== "on"){
			res.status(200).send("Success! Our best owl has delivered your request.");
		}
	});
});

app.get("/general-meetings", function(req, res){
	res.render("general-meetings");
});

app.get("/projects", function(req, res){
	res.render("projects");
});

app.get("/our-sponsors", function(req, res){
	res.render("our-sponsors");
});

app.get("/about-us", function(req, res){
	res.render("about-us");
});

app.get("/contact-us", function(req, res){
	res.render("contact-us");
});


// ajax post route for general contact us form
app.post("/contact-us/general", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("contact_name", sql.NVarChar, req.body.txtNameGen);
	sqlReq.input("email", sql.NVarChar, req.body.txtEmailGen);
	sqlReq.input("subject", sql.NVarChar, req.body.ddlSubjectGen);
	sqlReq.input("comments", sql.NVarChar, req.body.txtCommentsGen);


	var queryText = "INSERT INTO tbl_contact_requests " +
					"(contact_name, email, subject, comments) values " +
					"(@contact_name, @email, @subject, @comments) ";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send();
		} else if (req.body.chkNewsGen !== "on"){
			email.sendContactUsEmailGen(req.body);
			res.status(200).send("Success! Our best owl is on the way with your message.");
		}
	});

	if (req.body.chkNewsGen === "on"){
		sqlReq = new sql.Request();
		sqlReq.input("email", sql.NVarChar, req.body.txtEmailGen);

		var queryText = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
						"BEGIN " + 
						"INSERT INTO tbl_email_list (email) values (@email) " +
						"END";

		sqlReq.query(queryText, (err, result) => {
			if (err){
				res.status(400).send();
			} else {
				email.sendContactUsEmailGen(req.body);
				res.status(200).send("Success! Our best owl is on the way with your message.");
			}
		});
	}
});

// ajax post route for corporate contact us form
app.post("/contact-us/corporate", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("contact_name", sql.NVarChar, req.body.txtNameCorp);
	sqlReq.input("company", sql.NVarChar, req.body.txtCorp);
	sqlReq.input("email", sql.NVarChar, req.body.txtEmailCorp);
	sqlReq.input("subject", sql.NVarChar, req.body.ddlSubjectCorp);
	sqlReq.input("comments", sql.NVarChar, req.body.txtCommentsCorp);


	var queryText = "INSERT INTO tbl_contact_requests " +
					"(contact_type, company, contact_name, email, subject, comments) values " +
					"('company', @company, @contact_name, @email, @subject, @comments) ";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400);
			return;
		} else if (req.body.chkNewsCorp !== "on"){
			email.sendContactUsEmailCorp(req.body);
			res.status(200).send("Success! Our best owl is on the way with your message.");
			return;
		}
	});

	if (req.body.chkNewsCorp === "on"){
		sqlReq = new sql.Request();
		sqlReq.input("email", sql.NVarChar, req.body.txtEmailCorp);

		var queryText = "IF NOT EXISTS (SELECT * FROM tbl_corporate_email_list WHERE email = @email) " +
						"BEGIN " + 
						"INSERT INTO tbl_corporate_email_list (email) values (@email) " +
						"END";

		sqlReq.query(queryText, (err, result) => {
			if (err){
				res.status(400);
				return;
			} else {
				email.sendContactUsEmailCorp(req.body);
				res.status(200).send("Success! Our best owl is on the way with your message.");
				return;
			}
		});
	}
});

app.get("/unsubscribe/general/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/general/" + req.params.id + "'>Resubscribe?</a>");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

app.get("/resubscribe/general/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Resubscribed successfully!");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

app.get("/unsubscribe/corporate/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_corporate_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/corporate/" + req.params.id + "'>Resubscribe?</a>");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

app.get("/resubscribe/corporate/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_corporate_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Resubscribed successfully!");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

app.get("/terms-and-conditions", function(req, res){
	res.render("terms-and-conditions");
});

app.get("/privacy-policy", function(req, res){
	res.render("privacy-policy");
});

app.get('/sitemap.xml', function(req, res) {
	res.sendFile(__dirname + '/sitemap.xml');
});

app.get('/robots.txt', function(req, res) {
	res.sendFile(__dirname + '/robots.txt');
});

app.use(function(req, res, next){
	// store current user
	res.locals.user = req.user;
	next();
});

app.get('/portal/', checkAuthenticated, function(req, res) {
	res.render('portal/');
});

app.get('/portal/login', checkNotAuthenticated, function(req, res) {
	res.render("portal/login");
});

/*app.get('/portal/register', checkNotAuthenticated, function(req, res) {
	res.render("portal/register");
});*/

app.post('/portal/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/portal/',
	failureRedirect: '/portal/login',
	failureFlash: true
}));

/*app.post('/portal/register', checkNotAuthenticated, async function(req, res) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.txtPassword, 10);

		var sqlReq = new sql.Request();

		sqlReq.input("first_name", sql.NVarChar, req.body.txtFirstName);
		sqlReq.input("last_name", sql.NVarChar, req.body.txtLastName);
		sqlReq.input("email", sql.NVarChar, req.body.txtEmailAddress);
		sqlReq.input("password_hash", sql.NVarChar, hashedPassword);
		sqlReq.input("receiveNewsletter", sql.Bit, req.body.chkNews === "on");


		var queryText = "IF NOT EXISTS (SELECT * FROM tbl_user WHERE email = @email) " +
						"BEGIN " + 
						"INSERT INTO tbl_user (first_name, last_name, email, password_hash, receiveNewsletter) " +
						"values (@first_name, @last_name, @email, @password_hash, @receiveNewsletter) " +
						"END";

		sqlReq.query(queryText, (err, result) => {
			if (err){
				console.log(err)
				req.flash("error", "Error creating account. Please contact us if the error persists.");
				res.redirect("/portal/register");
			} else if (result.rowsAffected == 0){ 
				req.flash("error", "Error creating account. Your email address in use.");
				res.redirect("/portal/register");
			} else {
				res.redirect("/portal/login");
			}
		});
	} catch {
		res.redirect("/portal/register");
	}
});*/

app.delete("/portal/logout", (req, res) => {
	req.logOut();
	res.redirect('/portal/login');
});

app.get("/*", function(req, res){
	res.render("404");
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/portal/login");
	}
}

function checkNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/portal/')
	}
}

app.listen(process.env.PORT || 8080);
