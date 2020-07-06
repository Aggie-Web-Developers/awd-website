const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var queryText = ' SELECT * FROM tbl_sponsors ORDER BY sponsor_date ASC';

	var sqlReq = new sql.Request().query(queryText, (err, result) => {
		if (err) {
			console.log(err);
			req.flash('error', 'Error loading sponsors.');
		} else {
			res.render('portal/sponsors/index', { sponsors: result.recordset });
		}
	});
});

router.get('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.params.id)
		.query('SELECT TOP 1 * FROM tbl_sponsors WHERE id = @id', (err, result) => {
			if (err) {
				req.flash('error', 'Error loading sponsors.');
				res.redirect('/portal/sponsors/');
			} else {
				res.render('portal/sponsors/edit', { sponsor: result.recordset[0] });
			}
		});
});

router.put('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var queryText =
		'UPDATE tbl_sponsors ' +
		'SET name = @name, deleted = @deleted, sponsor_date = @sponsor_date, image_url = @image_url, refer_url = @refer_url WHERE id = @id';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('sponsor_date', sql.NVarChar, req.body.txtDate);
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('refer_url', sql.NVarChar, req.body.txtReferLink);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0) {
			console.log(err);
			req.flash('error', 'Error updating sponsor.');
		} else {
			req.flash('success', 'Success! Sponsor updated.');
			res.redirect('/portal/sponsors/');
		}
	});
});

router.get('/new', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/sponsors/new');
});

router.post('/new', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();

	var queryText =
		'INSERT INTO tbl_sponsors (name, deleted, sponsor_date, image_url, refer_url) VALUES ' +
		'(@name, @deleted, @sponsor_date, @image_url, @refer_url)';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('sponsor_date', sql.NVarChar, req.body.txtDate);
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('refer_url', sql.NVarChar, req.body.txtReferLink);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0) {
			console.log(err);
			req.flash('error', 'Error creating sponsor.');
		} else {
			req.flash('success', 'Success! Sponsor created.');
			res.redirect('/portal/sponsors/');
		}
	});
});

module.exports = router;
