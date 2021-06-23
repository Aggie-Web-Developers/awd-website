require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sql = require('mssql');
const email = require('./email/email');
const bcrypt = require('bcrypt');
const initPassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const indexRoutes = require('./routes/index');
const eventRoutes = require('./routes/portal/events');
const portalRoutes = require('./routes/portal/index');
const emailRoutes = require('./routes/portal/emails');
const sponsorRoutes = require('./routes/portal/sponsors');
const projectRoutes = require('./routes/portal/projects');
const middleware = require('./middleware');

// overload console.error to send error emails when an error occurs
console.error = async (err) => {
	await email.sendErrorEmail(err); // send error email
	console.log(err); // print error to console
};

initPassport(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

const config = {
	server: process.env.DB_SERVER,
	port: 1433,
	user: process.env.DB_USER || '',
	password: process.env.DB_PASSWORD,
	database: process.env.DB_PROD || 'awd-site-dev',
	stream: false,
	options: {
		enableArithAbort: true,
		encrypt: false,
		useUTC: true,
	},
	pool: {
		max: 20,
		min: 0,
		idleTimeoutMillis: 30000,
	},
};

sql
	.connect(config)
	.then((pool) => {
		if (pool.connected) {
			console.log('Connecting to database: [OK]');
		}

		return pool;
	})
	.catch(function (err) {
		console.log('Connecting to database: [FAILED]');
		console.error(err);
	});

app.use(function (err, req, res, next) {
	if (err && err == 'Error: Deserialization error.') {
		req.logout();

		if (req.originalUrl == '/portal/login') {
			next();
		} else {
			req.flash('error', 'Error: Please contact the System Administrator');
			res.redirect('/portal/login');
		}
	} else {
		next();
	}
});

app.use(function (req, res, next) {
	// store current user
	res.locals.user = req.user;
	next();
});

app.use(indexRoutes);
app.use('/portal', portalRoutes);
app.use('/portal/events', eventRoutes);
app.use('/portal/emails', emailRoutes);
app.use('/portal/sponsors', sponsorRoutes);
app.use('/portal/projects', projectRoutes);

app.get('/*', function (req, res) {
	res.render('404');
});

email.listenForScheduledEmails();

app.listen(process.env.PORT || 8080);
