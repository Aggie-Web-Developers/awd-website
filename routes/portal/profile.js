const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var sqlQuery =
		'SELECT tbl_officer_positions.name FROM tbl_user INNER JOIN tbl_officer_positions ON tbl_user.officer_id = tbl_officer_positions.id WHERE tbl_user.id = @id;';

	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.user.id)
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/profile', {
				user_position: result.recordset[0].name,
			});
		})
		.catch((err) => {
			res.render('portal/profile', { user_position: 'Member' });
		});

});

router.get('/edit', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/profile/edit');
});

router.put('/edit', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var sqlQuery =
		'UPDATE tbl_user ' +
		'SET first_name = @first_name, last_name = @last_name, email = @email, website = @website WHERE id = @id';

	sqlReq.input('id', sql.Int, req.user.id);
	sqlReq.input('first_name', sql.NVarChar, req.body.txtUserFirstName);
	sqlReq.input('last_name', sql.NVarChar, req.body.txtUserLastName);
	sqlReq.input('email', sql.NVarChar, req.body.txtUserEmail);
	sqlReq.input('website', sql.NVarChar, req.body.txtUserWebsite);
	// sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				req.flash('error', 'Error updating profile.');
				res.redirect('/portal/profile');
			} else {
				req.flash('success', 'Success! Profile updated.');
				res.redirect('/portal/profile');
			}
		})
		.catch((err) => {
			req.flash('error', 'Error updating profile.');
			res.redirect('/portal/profile');
		});
});

module.exports = router;
