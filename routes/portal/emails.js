var express    = require("express"),
    router     = express.Router(),
    flash      = require('express-flash'),
    sql        = require('mssql'),
    middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function(req, res) {
	var queryText =" SELECT em.*, e.name as event_name FROM tbl_emails em LEFT JOIN tbl_events e ON e.id = em.event_id ORDER BY em.deleted ASC, em.create_date DESC";


	var sqlReq = new sql.Request().query(queryText, (err, result) => {
		if (err){
			console.log(err)
			req.flash("error", "Error loading emails.");
		} else {
			res.render('portal/emails/index', { emails: result.recordset });
		}
	});
});

router.get('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().input("id", sql.Int, req.params.id).query("SELECT TOP 1 * FROM tbl_emails WHERE id = @id", (err, result) => {
		if (err){
			req.flash("error", "Error loading emails.");
			res.redirect("/portal/emails/");
		} else {
			res.render('portal/emails/edit', { email: result.recordset[0] });
		}
	});
});

router.put('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();
	var queryText = "";
	
	if (req.body.txtSendDate != "") {
		var user_date = new Date(req.body.txtSendDate + " " + req.body.txtSendTime);
		var converted_date = new Date(user_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');
		sqlReq.input("send_date", sql.NVarChar, converted_date);

		queryText = "UPDATE tbl_emails " +
			        "SET subject = @subject, deleted = @deleted, recip_type = @recip_type, body = @body, sending_user_id = @sending_user_id, send_date = @send_date WHERE id = @id";
	} else {
		queryText = "UPDATE tbl_emails " +
			        "SET subject = @subject, deleted = @deleted, recip_type = @recip_type, body = @body, sending_user_id = @sending_user_id WHERE id = @id";
	}

	sqlReq.input("id", sql.Int, req.params.id);
	sqlReq.input("subject", sql.NVarChar, req.body.txtSubject);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("recip_type", sql.NVarChar, req.body.ddlEmailType);
	sqlReq.input("body", sql.NVarChar, req.body.txtBody);
	sqlReq.input("sending_user_id", sql.Int, req.user.id);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0){
			console.log(err)
			req.flash("error", "Error updating email.");
		} else {
			req.flash("success", "Success! Email updated.");
			res.redirect("/portal/emails/");
		}
	});
});

router.get('/new', middleware.checkAuthenticated, function(req, res) {
	res.render("portal/emails/new");
});

router.post('/new', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();
	var queryText = "";
	
	if (req.body.txtSendDate != "") {
		var user_date = new Date(req.body.txtSendDate + " " + req.body.txtSendTime);
		var converted_date = new Date(user_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');
		sqlReq.input("send_date", sql.NVarChar, converted_date);

		queryText = "INSERT INTO tbl_emails " +
			        "(subject, deleted, recip_type, body, sending_user_id, send_date) values " +
		     	    "(@subject, @deleted, @recip_type, @body, @sending_user_id, @send_date) ";
	} else {
		queryText = "INSERT INTO tbl_emails " +
			        "(subject, deleted, recip_type, body, sending_user_id) values " +
		     	    "(@subject, @deleted, @recip_type, @body, @sending_user_id) ";
	}

	sqlReq.input("subject", sql.NVarChar, req.body.txtSubject);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("recip_type", sql.NVarChar, req.body.ddlEmailType);
	sqlReq.input("body", sql.NVarChar, req.body.txtBody);
	sqlReq.input("sending_user_id", sql.Int, req.user.id);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0){
			console.log(err)
			req.flash("error", "Error creating email.");
		} else {
			req.flash("success", "Success! Email created.");
			res.redirect("/portal/emails/");
		}
	});
});

module.exports = router;
