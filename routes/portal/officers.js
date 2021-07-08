const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkIsOfficer, function (req, res) {
	var sqlQuery =
		'SELECT o.*,u.id AS user_id, CONCAT(u.first_name, \' \', u.last_name) AS user_name ' +
        'FROM tbl_officer_positions o ' +
        'LEFT JOIN tbl_user u ON o.id = u.officer_id ';

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
            //console.log(result.recordset);
            //res.send("OK");
			res.render('portal/officers/index', { officers: result.recordset });
		})
		.catch((err) => {
			console.error(err);
			req.flash('error', 'Error loading events.');
			res.render('portal/officers/index', { events: [] });
		});
});

module.exports = router;

