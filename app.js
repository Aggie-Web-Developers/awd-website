var express        = require('express'),
    session        = require('express-session'),
	app            = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	sql            = require('mssql'),
	email          = require('./email/email'),
	bcrypt         = require('bcrypt'),
	initPassport   = require('./passport-config'),
	passport       = require('passport'),
	flash          = require('express-flash'),
	indexRoutes    = require("./routes/index"),
	eventRoutes    = require("./routes/portal/events"),
	portalRoutes   = require("./routes/portal/index"),
	emailRoutes   = require("./routes/portal/emails"),
	middleware     = require('./middleware');

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
	database: process.env.DB_PROD || "awd-site-dev",
	stream: false,
	options: {
		enableArithAbort: true,
		encrypt: false,
		useUTC: true
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

app.use(function(req, res, next){
	// store current user
	res.locals.user = req.user;
	next();
});

app.use(indexRoutes);
app.use("/portal", portalRoutes);
app.use("/portal/events", eventRoutes);
app.use("/portal/emails", emailRoutes);

app.get("/*", function(req, res){
	res.render("404");
});

app.listen(process.env.PORT || 8080);
