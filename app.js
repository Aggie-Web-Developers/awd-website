var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	methodOverride = require("method-override"),
	sql            = require("mssql");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var config = {
	server: process.env.DB_SERVER,
	port: 1433,
	user: "sa",
	password: process.env.DB_PASSWORD,
	database: "awd-site",
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
	console.log("Connecting to database: ");

	if (pool.connected){
		console.log("[OK]");
	}

	return pool;
}).catch(function(err) {
	console.log("[FAILED]");
	console.log(error);
});


app.get("/", function(req, res){
	res.render("index");
});

// handle signup
app.post("/", function(req, res){
	var email = req.body.txtEmail;

	var sqlReq = new sql.Request();

	sqlReq.input("email", sql.NVarChar, email);

	var queryText = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
					"BEGIN " + 
					"INSERT INTO tbl_email_list (email) values (@email) " +
					"END";

	// TODO, better error handling
	sqlReq.query(queryText, (err, result) => {
		if (err){
			console.log(err);
		}
	});

	res.render("index");
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
			res.status(400);
		} else if (req.body.chkNewsGen !== "on"){
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
				res.status(400);
			} else {
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
				res.status(200).send("Success! Our best owl is on the way with your message.");
				return;
			}
		});
	}
});

app.listen(process.env.PORT || 8080);