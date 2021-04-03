const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/profile/');
});

module.exports = router;
