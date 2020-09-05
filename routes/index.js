const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const email = require('../email/email');
const path = require('path');
const middleware = require('../middleware');

router.get('/', function (req, res) {
	var sqlQuery =
		"SELECT TOP 3 e.*, (u.first_name + ' ' + u.last_name) as author " +
		'FROM tbl_events  e LEFT JOIN tbl_user u on u.id = e.creating_user_id ' +
		'WHERE e.[start_date] <= GETUTCDATE() AND e.[end_date] >= GETUTCDATE() AND e.deleted = 0 ORDER BY e.event_time ASC';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('index', { events: result.recordset });
		})
		.catch((err) => {
			req.flash('error', "Whoops! We couldn't grab the news or events.");
			res.render('index', { events: null });
		});
});

// handle email list signup from index page
router.post('/', function (req, res) {
	var email = req.body.txtEmail;
	var sqlReq = new sql.Request();

	sqlReq.input('email', sql.NVarChar, email);

	var sqlQuery =
		'IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) ' +
		'BEGIN ' +
		'INSERT INTO tbl_email_list (email) values (@email) ' +
		'END';

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			res.status(200).send('Success! Our best owl has delivered your request.');
		})
		.catch((err) => {
			res.status(400).send();
		});
});

router.get('/general-meetings', function (req, res) {
	var sqlQuery =
		"SELECT TOP 3 e.*, (u.first_name + ' ' + u.last_name) as author " +
		'FROM tbl_events  e LEFT JOIN tbl_user u on u.id = e.creating_user_id ' +
		"WHERE e.[start_date] <= GETUTCDATE() AND e.[end_date] >= GETUTCDATE() AND e.deleted = 0 AND e.type != 'News' ORDER BY e.event_time ASC";

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('general-meetings', { events: result.recordset });
		})
		.catch((err) => {
			req.flash('error', "Whoops! We couldn't grab meeting events.");
			res.render('general-meetings', { events: null });
		});
});

router.get('/projects', function (req, res) {
	var sqlQuery =
		'SELECT  * FROM tbl_projects WHERE deleted = 0 ORDER BY start_date ASC';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('projects', { projects: result.recordset });
		})
		.catch((err) => {
			req.flash('error', "Whoops! We couldn't grab our projects.");
			res.render('projects', { projects: [] });
		});
});

router.get('/our-sponsors', function (req, res) {
	var sqlQuery =
		'SELECT  * FROM tbl_sponsors WHERE deleted = 0 ORDER BY sponsor_date ASC';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('our-sponsors', { sponsors: result.recordset });
		})
		.catch((err) => {
			req.flash('error', 'Error loading sponsors.');
			res.render('our-sponsors', { sponsors: null });
		});
});

router.get('/about-us', function (req, res) {
	res.render('about-us');
});

router.get('/contact-us', function (req, res) {
	res.render('contact-us');
});

// ajax post route for general contact us form
router.post('/contact-us/general', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('contact_name', sql.NVarChar, req.body.txtNameGen);
	sqlReq.input('email', sql.NVarChar, req.body.txtEmailGen);
	sqlReq.input('subject', sql.NVarChar, req.body.ddlSubjectGen);
	sqlReq.input('comments', sql.NVarChar, req.body.txtCommentsGen);

	var sqlQuery =
		'INSERT INTO tbl_contact_requests ' +
		'(contact_name, email, subject, comments) values ' +
		'(@contact_name, @email, @subject, @comments) ';

	sqlReq
		.query(sqlQuery)
		.then(async (result) => {
			if (req.body.chkNewsGen !== 'on') {
				const emailStatus = await email.sendContactUsEmailGen(req.body);

				if (emailStatus == 'Success') {
					res
						.status(200)
						.send('Success! Our best owl is on the way with your message.');
				} else {
					res.status(400).send();
				}
			}
		})
		.catch((err) => {
			res.status(400).send();
		});

	if (req.body.chkNewsGen === 'on') {
		sqlReq = new sql.Request();
		sqlReq.input('email', sql.NVarChar, req.body.txtEmailGen);

		sqlQuery =
			'IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) ' +
			'BEGIN ' +
			'INSERT INTO tbl_email_list (email) values (@email) ' +
			'END';

		sqlReq
			.query(sqlQuery)
			.then(async (result) => {
				const emailStatus = await email.sendContactUsEmailGen(req.body);

				if (emailStatus == 'Success') {
					res
						.status(200)
						.send('Success! Our best owl is on the way with your message.');
				} else {
					res.status(400).send();
				}
			})
			.catch((err) => {
				res.status(400).send();
			});
	}
});

// ajax post route for corporate contact us form
router.post('/contact-us/corporate', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('contact_name', sql.NVarChar, req.body.txtNameCorp);
	sqlReq.input('company', sql.NVarChar, req.body.txtCorp);
	sqlReq.input('email', sql.NVarChar, req.body.txtEmailCorp);
	sqlReq.input('subject', sql.NVarChar, req.body.ddlSubjectCorp);
	sqlReq.input('comments', sql.NVarChar, req.body.txtCommentsCorp);

	var sqlQuery =
		'INSERT INTO tbl_contact_requests ' +
		'(contact_type, company, contact_name, email, subject, comments) values ' +
		"('company', @company, @contact_name, @email, @subject, @comments) ";

	sqlReq
		.query(sqlQuery)
		.then(async (result) => {
			if (req.body.chkNewsCorp !== 'on') {
				const emailStatus = await email.sendContactUsEmailCorp(req.body);

				if (emailStatus == 'Success') {
					res
						.status(200)
						.send('Success! Our best owl is on the way with your message.');
				} else {
					res.status(400).send();
				}
			}
		})
		.catch((err) => {
			res.status(400).send();
		});

	if (req.body.chkNewsCorp === 'on') {
		sqlReq = new sql.Request();
		sqlReq.input('email', sql.NVarChar, req.body.txtEmailCorp);

		sqlQuery =
			'IF NOT EXISTS (SELECT * FROM tbl_corporate_email_list WHERE email = @email) ' +
			'BEGIN ' +
			'INSERT INTO tbl_corporate_email_list (email) values (@email) ' +
			'END';

		sqlReq
			.query(sqlQuery)
			.then(async (result) => {
				const emailStatus = await email.sendContactUsEmailCorp(req.body);

				if (emailStatus == 'Success') {
					res
						.status(200)
						.send('Success! Our best owl is on the way with your message.');
				} else {
					res.status(400).send();
				}
			})
			.catch((err) => {
				res.status(400).send();
			});
	}
});

router.get('/unsubscribe/general/:id', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('unsubscribe_guid', sql.NVarChar, req.params.id);

	var sqlQuery =
		'UPDATE tbl_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid';

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected != 0) {
				res
					.status(200)
					.send(
						"Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/general/" +
							req.params.id +
							"'>Resubscribe?</a>"
					);
				return;
			} else {
				res
					.status(400)
					.send(
						'We were unable to process your request, please contact us to resolve this issue.'
					);
			}
		})
		.catch((err) => {
			res
				.status(400)
				.send(
					'We were unable to process your request, please contact us to resolve this issue.'
				);
		});
});

router.get('/resubscribe/general/:id', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('unsubscribe_guid', sql.NVarChar, req.params.id);

	var sqlQuery =
		'UPDATE tbl_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid';

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected != 0) {
				res.status(200).send('Resubscribed successfully!');
				return;
			} else {
				res
					.status(400)
					.send(
						'We were unable to process your request, please contact us to resolve this issue.'
					);
			}
		})
		.catch((err) => {
			res
				.status(400)
				.send(
					'We were unable to process your request, please contact us to resolve this issue.'
				);
		});
});

router.get('/unsubscribe/corporate/:id', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('unsubscribe_guid', sql.NVarChar, req.params.id);

	var sqlQuery =
		'UPDATE tbl_corporate_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid';

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected != 0) {
				res
					.status(200)
					.send(
						"Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/corporate/" +
							req.params.id +
							"'>Resubscribe?</a>"
					);
				return;
			} else {
				res
					.status(400)
					.send(
						'We were unable to process your request, please contact us to resolve this issue.'
					);
			}
		})
		.catch((err) => {
			res
				.status(400)
				.send(
					'We were unable to process your request, please contact us to resolve this issue.'
				);
		});
});

router.get('/resubscribe/corporate/:id', function (req, res) {
	var sqlReq = new sql.Request();

	sqlReq.input('unsubscribe_guid', sql.NVarChar, req.params.id);

	var sqlQuery =
		'UPDATE tbl_corporate_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid';

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected != 0) {
				res.status(200).send('Resubscribed successfully!');
				return;
			} else {
				res
					.status(400)
					.send(
						'We were unable to process your request, please contact us to resolve this issue.'
					);
			}
		})
		.catch((err) => {
			res
				.status(400)
				.send(
					'We were unable to process your request, please contact us to resolve this issue.'
				);
		});
});

router.get('/terms-and-conditions', function (req, res) {
	res.render('terms-and-conditions');
});

router.get('/privacy-policy', function (req, res) {
	res.render('privacy-policy');
});

router.get('/sitemap.xml', function (req, res) {
	res.sendFile(path.join(__dirname, '../sitemap.xml'));
});

router.get('/robots.txt', function (req, res) {
	res.sendFile(path.join(__dirname, '../robots.txt'));
});

module.exports = router;
