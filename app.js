var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	methodOverride = require("method-override");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.render("index");
});

// handle signup
app.post("/", function(req, res){
	var email = req.body.txtEmail;

	/* Insert Into Database
	var query = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
				"BEGIN " +
				"INSERT INTO tbl_email_list (email) values (@email) " +
				"END";*/

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

app.post("/contact-us/general", function(req, res){
	res.redirect("/contact-us");
});

app.post("/contact-us/corporate", function(req, res){
	res.redirect("/contact-us");
});

app.get("/*", function(req, res){
	res.render("404");
});

app.listen(process.env.PORT || 8080);
