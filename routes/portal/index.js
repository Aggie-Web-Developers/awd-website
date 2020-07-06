var express = require('express'),
	router = express.Router(),
	flash = require('express-flash'),
	sql = require('mssql'),
	passport = require('passport'),
	bcrypt = require('bcrypt'),
	middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/');
});

router.get('/login', middleware.checkNotAuthenticated, function (req, res) {
	res.render('portal/login');
});

router.post(
	'/login',
	middleware.checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/portal/',
		failureRedirect: '/portal/login',
		failureFlash: true,
	})
);

/*router.get('/register', middleware.checkNotAuthenticated, function(req, res) {
	res.render('portal/register');
});

router.post('/register', middleware.checkNotAuthenticated, async function(req, res) {
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
				console.log(err);
				req.flash("error", "Error creating account. Please contact us if the error persists.");
				res.redirect('/portal/register');
			} else if (result.rowsAffected == 0) { 
				req.flash("error", "Error creating account. Your email address in use.");
				res.redirect('/portal/register');
			} else {
				res.redirect('/portal/login');
			}
		});
	} catch {
		res.redirect('/portal/register');
	}
});*/

router.delete('/logout', middleware.checkAuthenticated, (req, res) => {
	req.logOut();
	res.redirect('/portal/login');
});

module.exports = router;
