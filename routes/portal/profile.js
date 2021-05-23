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
			res.render('portal/profile/index', {
				user_position: result.recordset[0].name,
			});
		})
		.catch((err) => {
			res.render('portal/profile/index', { user_position: 'Member' });
		});
});

module.exports = router;