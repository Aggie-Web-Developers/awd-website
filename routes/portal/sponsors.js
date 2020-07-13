const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request()
		.query('SELECT * FROM tbl_sponsors ORDER BY sponsor_date ASC')
		.then((result) => {
			res.render('portal/sponsors/index', { sponsors: result.recordset });
		})
		.catch((err) => {
			req.flash('error', 'Error loading sponsors.');
			res.render('portal/sponsors/index', { sponsors: [] });
		});
});

router.get('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.params.id)
		.query('SELECT TOP 1 * FROM tbl_sponsors WHERE id = @id')
		.then((result) => {
			if (result.recordset.length > 0) {
				res.render('portal/sponsors/edit', { sponsor: result.recordset[0] });
			} else {
				req.flash('error', 'Error sponsor does not exist.');
				res.redirect('/portal/sponsors/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error loading sponsors.');
			res.redirect('/portal/sponsors/');
		});
});

router.put('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var sqlQuery =
		'UPDATE tbl_sponsors ' +
		'SET name = @name, deleted = @deleted, sponsor_date = @sponsor_date, image_url = @image_url, refer_url = @refer_url WHERE id = @id';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('sponsor_date', sql.NVarChar, req.body.txtDate);
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('refer_url', sql.NVarChar, req.body.txtReferLink);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				req.flash('error', 'Error updating sponsor.');
				res.redirect('/portal/sponsors/');
			} else {
				req.flash('success', 'Success! Sponsor updated.');
				res.redirect('/portal/sponsors/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error updating sponsor.');
			res.redirect('/portal/sponsors/');
		});
});

router.get('/new', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/sponsors/new');
});

router.post('/new', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();

	var sqlQuery =
		'INSERT INTO tbl_sponsors (name, deleted, sponsor_date, image_url, refer_url) VALUES ' +
		'(@name, @deleted, @sponsor_date, @image_url, @refer_url)';

	var queryText =
		'INSERT INTO tbl_sponsors (name, deleted, sponsor_date, image_url, refer_url) VALUES ' +
		'(@name, @deleted, @sponsor_date, @image_url, @refer_url)';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('sponsor_date', sql.NVarChar, req.body.txtDate);
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('refer_url', sql.NVarChar, req.body.txtReferLink);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				req.flash('error', 'Error creating sponsor.');
				res.redirect('/portal/sponsors/');
			} else {
				req.flash('success', 'Success! Sponsor created.');
				res.redirect('/portal/sponsors/');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error creating sponsor.');
			res.redirect('/portal/sponsors/');
		});
});

module.exports = router;
