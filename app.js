var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	methodOverride = require("method-override"),
	sql            = require("mssql"),
	email          = require("./email/email");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var config = {
	server: process.env.DB_SERVER,
	port: 1433,
	user: "sa",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_PROD || "awd-site-dev",
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

app.get("/*", function(req, res){
	res.render("404");
});

app.listen(process.env.PORT || 8080);
