const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkIsOfficer, function (req, res) {
	var sqlQuery =
		"SELECT o.*,u.id AS user_id, CONCAT(u.first_name, ' ', u.last_name) AS user_name " +
		'FROM tbl_officer_positions o ' +
		'LEFT JOIN tbl_user u ON o.id = u.officer_id ';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/officers/index', { officers: result.recordset });
		})
		.catch((err) => {
			console.error(err);
			req.flash('error', 'Error loading events.');
			res.render('portal/officers/index', { officers: [] });
		});
});

router.get('/edit/:id', middleware.checkIsOfficer, function (req, res) {
	var sqlQuery =
		"SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, " +
		'(SELECT TOP 1 id FROM tbl_user WHERE officer_id = @id) as current_officer_user_id, ' +
		'(SELECT TOP 1 name FROM tbl_officer_positions WHERE id = @id) as officer_position ' +
		'FROM tbl_user u ';

	new sql.Request()
		.input('id', sql.Int, req.params.id)
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/officers/edit', {
				users: result.recordset,
				officer_id: req.params.id,
			});
		})
		.catch((err) => {
			console.error(err);
			req.flash('error', 'Error loading events.');
			res.redirect('/portal/officers/');
		});
});

router.put('/edit/:id', middleware.checkIsOfficer, function (req, res) {
	var sqlQuery =
		'UPDATE tbl_user SET officer_id = NULL WHERE officer_id = @officer_id;' +
		'UPDATE tbl_user SET officer_id = @officer_id WHERE id = @user_id;';

	new sql.Request()
		.input('officer_id', sql.Int, req.params.id)
		.input('user_id', sql.Int, req.body.ddlUser)
		.query(sqlQuery)
		.then((result) => {
			req.flash('success', 'Success! Officer updated.');
			res.redirect('/portal/officers');
		})
		.catch((err) => {
			console.error(err);
			req.flash('error', 'Error loading events.');
			res.redirect('/portal/officers/');
		});
});

module.exports = router;
