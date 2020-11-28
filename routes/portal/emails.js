const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');
const email = require('../../email/email');
const moment = require('moment');
const tz = require('moment-timezone');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var sqlQuery =
		'SELECT em.*, e.name as event_name FROM tbl_emails em LEFT JOIN tbl_events e ON e.id = em.event_id ORDER BY em.deleted ASC, em.create_date DESC';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/emails/index', { emails: result.recordset });
		})
		.catch((err) => {
			req.flash('error', 'Error loading emails.');
			res.render('portal/emails/index', { emails: [] });
		});
});

router.get('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.params.id)
		.query('SELECT TOP 1 * FROM tbl_emails WHERE id = @id')
		.then((result) => {
			if (result.recordset.length > 0) {
				res.render('portal/emails/edit', { email: result.recordset[0] });
			} else {
				req.flash('error', 'Error email does not exist.');
				res.redirect('/portal/emails/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error loading selected email.');
			res.redirect('/portal/emails/');
		});
});

router.put('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var sqlQuery = '';

	if (req.body.txtSendDate != '') {
		var user_date = new Date(req.body.txtSendDate + ' ' + req.body.txtSendTime);

		user_date.setMinutes(
			user_date.getMinutes() + user_date.getTimezoneOffset()
		);

		sqlReq.input(
			'send_date',
			sql.NVarChar,
			moment(user_date).format('YYYY-MM-DD HH:mm:ss')
		);

		sqlQuery =
			'UPDATE tbl_emails ' +
			'SET subject = @subject, deleted = @deleted, recip_type = @recip_type, body = @body, sending_user_id = @sending_user_id, send_date = @send_date WHERE id = @id';
	} else {
		sqlQuery =
			'UPDATE tbl_emails ' +
			'SET subject = @subject, deleted = @deleted, recip_type = @recip_type, body = @body, sending_user_id = @sending_user_id WHERE id = @id';
	}

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('subject', sql.NVarChar, req.body.txtSubject);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('recip_type', sql.NVarChar, req.body.ddlEmailType);
	sqlReq.input('body', sql.NVarChar, req.body.txtBody);
	sqlReq.input('sending_user_id', sql.Int, req.user.id);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				req.flash('error', 'Error updating email.');
				res.redirect('/portal/emails/');
			} else {
				req.flash('success', 'Success! Email updated.');
				res.redirect('/portal/emails/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error updating email.');
			res.redirect('/portal/emails/');
		});
});

router.get('/new', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/emails/new');
});

router.post('/new', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var sqlQuery = '';

	// If user has specified a date to send the email at
	if (req.body.txtSendDate != '') {
		var user_date = new Date(req.body.txtSendDate + ' ' + req.body.txtSendTime);

		user_date.setMinutes(
			user_date.getMinutes() + user_date.getTimezoneOffset()
		);

		sqlReq.input(
			'send_date',
			sql.NVarChar,
			moment(user_date).format('YYYY-MM-DD HH:mm:ss')
		);

		sqlQuery =
			'INSERT INTO tbl_emails ' +
			'(subject, deleted, recip_type, body, sending_user_id, send_date) values ' +
			'(@subject, @deleted, @recip_type, @body, @sending_user_id, @send_date) ';
	} else {
		sqlQuery =
			'INSERT INTO tbl_emails ' +
			'(subject, deleted, recip_type, body, sending_user_id) values ' +
			'(@subject, @deleted, @recip_type, @body, @sending_user_id) ';
	}

	sqlReq.input('subject', sql.NVarChar, req.body.txtSubject);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('recip_type', sql.NVarChar, req.body.ddlEmailType);
	sqlReq.input('body', sql.NVarChar, req.body.txtBody);
	sqlReq.input('sending_user_id', sql.Int, req.user.id);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				req.flash('error', 'Error creating email.');
				res.redirect('/portal/emails/');
			} else {
				req.flash('success', 'Success! Email created.');
				res.redirect('/portal/emails/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error creating email.');
			res.redirect('/portal/emails/');
		});
});

router.get('/send/:id', middleware.checkAuthenticated, async function (
	req,
	res
) {
	const emailStatus = await email.sendAdminEmail(req.params.id);

	if (emailStatus != 'Success') {
		req.flash('error', 'Error sending email.');
		res.redirect('/portal/emails/');
	} else {
		req.flash('success', 'Success! Email sent.');
		res.redirect('/portal/emails/');
	}
});

router.get('/test-send/:id', middleware.checkAuthenticated, async function (
	req,
	res
) {
	const emailStatus = await email.sendTestEmail(req.params.id);

	if (emailStatus != 'Success') {
		req.flash('error', 'Error sending test email.');
		res.redirect('/portal/emails/');
	} else {
		req.flash('success', 'Success! Test email sent.');
		res.redirect('/portal/emails/');
	}
});

module.exports = router;
