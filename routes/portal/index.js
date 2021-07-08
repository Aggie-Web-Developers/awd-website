const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const passport = require('passport');
const bcrypt = require('bcrypt');
const middleware = require('../../middleware');

router.get('/', middleware.checkIsOfficer, function (req, res) {
	res.render('portal/');
});

router.get('/login', middleware.checkNotAuthenticated, function (req, res) {
	res.render('portal/login');
});

router.get('/member', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/index-member');
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

router.get('/register', middleware.checkNotAuthenticated, function (req, res) {
	res.render('portal/register');
});

router.post('/register', middleware.checkNotAuthenticated, async function (
	req,
	res
) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.txtPassword, 10);
		var sqlReq = new sql.Request();
		sqlReq.input('first_name', sql.NVarChar, req.body.txtFirstName);
		sqlReq.input('last_name', sql.NVarChar, req.body.txtLastName);
		sqlReq.input('email', sql.NVarChar, req.body.txtEmailAddress);
		sqlReq.input('password_hash', sql.NVarChar, hashedPassword);
		sqlReq.input('receiveNewsletter', sql.Bit, req.body.chkNews === 'on');
		var queryText =
			'IF NOT EXISTS (SELECT * FROM tbl_user WHERE email = @email) ' +
			'BEGIN ' +
			'INSERT INTO tbl_user (first_name, last_name, email, password_hash, receiveNewsletter) ' +
			'values (@first_name, @last_name, @email, @password_hash, @receiveNewsletter) ' +
			'END';
		sqlReq
			.query(queryText)
			.then((result) => {
				if (result.rowsAffected == 0) {
					req.flash(
						'error',
						'Error creating account. Your email address in use.'
					);
					res.redirect('/portal/register');
				} else {
					req.flash('success', 'Account created! Please log in.');
					res.redirect('/portal/login');
				}
			})
			.catch((err) => {
				console.error(err);

				req.flash(
					'error',
					'Error creating account. Please contact us if the error persists.'
				);
				res.redirect('/portal/register');
			});
	} catch {
		req.flash(
			'error',
			'Error creating account. Please contact us if the error persists.'
		);
		res.redirect('/portal/register');
	}
});

router.delete('/logout', middleware.checkAuthenticated, (req, res) => {
	req.logOut();
	res.redirect('/portal/login');
});

module.exports = router;
