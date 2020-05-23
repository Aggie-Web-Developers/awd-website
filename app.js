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

app.listen("3000");