const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const passport = require('passport');
const bcrypt = require('bcrypt');
const middleware = require('../../middleware');
const email = require('../../email/email');
const { v4: uuidv4 } = require('uuid');

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
		const activationId = uuidv4();
		const siteType =
			process.env.NODE_ENV == 'prod' ? 'aggiedevelopers.com' : 'localhost:8080';
		const link = 'http://' + siteType + '/portal/activate/' + activationId;

		var sqlReq = new sql.Request();
		sqlReq.input('first_name', sql.NVarChar, req.body.txtFirstName);
		sqlReq.input('last_name', sql.NVarChar, req.body.txtLastName);
		sqlReq.input('email', sql.NVarChar, req.body.txtEmailAddress);
		sqlReq.input('password_hash', sql.NVarChar, hashedPassword);
		sqlReq.input('receiveNewsletter', sql.Bit, req.body.chkNews === 'on');
		sqlReq.input('activation_id', sql.NVarChar, activationId);

		var queryText =
			'IF NOT EXISTS (SELECT * FROM tbl_user WHERE email = @email) ' +
			'BEGIN ' +
			'INSERT INTO tbl_user (first_name, last_name, email, password_hash, receiveNewsletter, activation_id) ' +
			'values (@first_name, @last_name, @email, @password_hash, @receiveNewsletter, @activation_id) ' +
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
					email.sendValidationEmail(
						req.body.txtFirstName,
						req.body.txtEmailAddress,
						link
					);

					req.flash(
						'success',
						'Account created! Please verify your email to login.'
					);
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

router.get('/activate/:id', function (req, res) {
	const uuidv4 = new RegExp(
		'^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
		'i'
	);

	// Verify the id passed in a valid UUID
	if (uuidv4.test(req.params.id)) {
		var sqlReq = new sql.Request();

		sqlReq.input('activation_id', sql.UniqueIdentifier, req.params.id);

		var sqlQuery =
			'UPDATE tbl_user SET activation_id = NULL WHERE activation_id = @activation_id';

		sqlReq
			.query(sqlQuery)
			.then((result) => {
				if (result.rowsAffected != 0) {
					req.flash(
						'success',
						'Email verified, please log in to access your account.'
					);
				} else {
					req.flash(
						'error',
						'We were unable to process your request, please contact us to resolve this issue.'
					);
				}

				res.redirect('/portal/login');
			})
			.catch((err) => {
				console.error(err);

				req.flash(
					'error',
					'We were unable to process your request, please contact us to resolve this issue.'
				);
				res.redirect('/portal/login');
			});
	} else {
		req.flash(
			'error',
			'We were unable to process your request, please contact us to resolve this issue.'
		);
		res.redirect('/portal/login');
	}
});

router.delete('/logout', middleware.checkAuthenticated, (req, res) => {
	req.logOut();
	res.redirect('/portal/login');
});

module.exports = router;
