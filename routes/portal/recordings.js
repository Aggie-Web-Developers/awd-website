const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');
const moment = require('moment');
const tz = require('moment-timezone');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var sqlQuery = "SELECT e.* FROM tbl_events e WHERE rec_url <> ''";

	var sqlReq = new sql.Request()
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/recordings/index', { events: result.recordset });
		})
		.catch((err) => {
			req.flash('error', 'Error loading events.');
			res.render('portal/recordings/index', { events: [] });
		});
});

module.exports = router;
