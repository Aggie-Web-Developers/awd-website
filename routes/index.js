var express    = require("express"),
    router     = express.Router(),
    flash      = require('express-flash'),
    sql        = require('mssql'),
    email      = require('../email/email'),
    path       = require('path')
    middleware = require('../middleware');

router.get("/", function(req, res){
	var sqlQuery = "SELECT TOP 3 e.*, (u.first_name + ' ' + u.last_name) as author " +
				   "FROM tbl_events  e LEFT JOIN tbl_user u on u.id = e.creating_user_id " + 
				   "WHERE e.[start_date] <= GETUTCDATE() AND e.[end_date] >= GETUTCDATE() AND e.deleted = 0 ORDER BY e.event_time ASC";

	var sqlReq = new sql.Request().query(sqlQuery, (err, result) => {
		if (err){
			console.log(err)
			req.flash("error", "Error loading events.");
		} else {
			res.render('index', { events: result.recordset });
		}
	});
});

// handle email list signup from index page
router.post("/", function(req, res){
	var email = req.body.txtEmail;
	var sqlReq = new sql.Request();

	sqlReq.input("email", sql.NVarChar, email);

	var queryText = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
					"BEGIN " + 
					"INSERT INTO tbl_email_list (email) values (@email) " +
					"END";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send();
		} else if (req.body.chkNewsGen !== "on"){
			res.status(200).send("Success! Our best owl has delivered your request.");
		}
	});
});

router.get("/general-meetings", function(req, res){
	var sqlQuery = "SELECT TOP 3 e.*, (u.first_name + ' ' + u.last_name) as author " +
				   "FROM tbl_events  e LEFT JOIN tbl_user u on u.id = e.creating_user_id " + 
				   "WHERE e.[start_date] <= GETUTCDATE() AND e.[end_date] >= GETUTCDATE() AND e.deleted = 0 AND e.type != 'News' ORDER BY e.event_time ASC";

	var sqlReq = new sql.Request().query(sqlQuery, (err, result) => {
		if (err){
			console.log(err)
			req.flash("error", "Error loading events.");
		} else {
			res.render('general-meetings', { events: result.recordset });
		}
	});
});

router.get("/projects", function(req, res){
	res.render("projects");
});

router.get("/our-sponsors", function(req, res){
	res.render("our-sponsors");
});

router.get("/about-us", function(req, res){
	res.render("about-us");
});

router.get("/contact-us", function(req, res){
	res.render("contact-us");
});

// ajax post route for general contact us form
router.post("/contact-us/general", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("contact_name", sql.NVarChar, req.body.txtNameGen);
	sqlReq.input("email", sql.NVarChar, req.body.txtEmailGen);
	sqlReq.input("subject", sql.NVarChar, req.body.ddlSubjectGen);
	sqlReq.input("comments", sql.NVarChar, req.body.txtCommentsGen);


	var queryText = "INSERT INTO tbl_contact_requests " +
					"(contact_name, email, subject, comments) values " +
					"(@contact_name, @email, @subject, @comments) ";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send();
		} else if (req.body.chkNewsGen !== "on"){
			email.sendContactUsEmailGen(req.body);
			res.status(200).send("Success! Our best owl is on the way with your message.");
		}
	});

	if (req.body.chkNewsGen === "on"){
		sqlReq = new sql.Request();
		sqlReq.input("email", sql.NVarChar, req.body.txtEmailGen);

		var queryText = "IF NOT EXISTS (SELECT * FROM tbl_email_list WHERE email = @email) " +
						"BEGIN " + 
						"INSERT INTO tbl_email_list (email) values (@email) " +
						"END";

		sqlReq.query(queryText, (err, result) => {
			if (err){
				res.status(400).send();
			} else {
				email.sendContactUsEmailGen(req.body);
				res.status(200).send("Success! Our best owl is on the way with your message.");
			}
		});
	}
});

// ajax post route for corporate contact us form
router.post("/contact-us/corporate", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("contact_name", sql.NVarChar, req.body.txtNameCorp);
	sqlReq.input("company", sql.NVarChar, req.body.txtCorp);
	sqlReq.input("email", sql.NVarChar, req.body.txtEmailCorp);
	sqlReq.input("subject", sql.NVarChar, req.body.ddlSubjectCorp);
	sqlReq.input("comments", sql.NVarChar, req.body.txtCommentsCorp);


	var queryText = "INSERT INTO tbl_contact_requests " +
					"(contact_type, company, contact_name, email, subject, comments) values " +
					"('company', @company, @contact_name, @email, @subject, @comments) ";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400);
			return;
		} else if (req.body.chkNewsCorp !== "on"){
			email.sendContactUsEmailCorp(req.body);
			res.status(200).send("Success! Our best owl is on the way with your message.");
			return;
		}
	});

	if (req.body.chkNewsCorp === "on"){
		sqlReq = new sql.Request();
		sqlReq.input("email", sql.NVarChar, req.body.txtEmailCorp);

		var queryText = "IF NOT EXISTS (SELECT * FROM tbl_corporate_email_list WHERE email = @email) " +
						"BEGIN " + 
						"INSERT INTO tbl_corporate_email_list (email) values (@email) " +
						"END";

		sqlReq.query(queryText, (err, result) => {
			if (err){
				res.status(400);
				return;
			} else {
				email.sendContactUsEmailCorp(req.body);
				res.status(200).send("Success! Our best owl is on the way with your message.");
				return;
			}
		});
	}
});

router.get("/unsubscribe/general/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/general/" + req.params.id + "'>Resubscribe?</a>");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

router.get("/resubscribe/general/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Resubscribed successfully!");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

router.get("/unsubscribe/corporate/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_corporate_email_list SET deleted = 1 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Unsubscribed successfully. Sorry to see you go! <a href='/resubscribe/corporate/" + req.params.id + "'>Resubscribe?</a>");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

router.get("/resubscribe/corporate/:id", function(req, res){
	var sqlReq = new sql.Request();

	sqlReq.input("unsubscribe_guid", sql.NVarChar, req.params.id);

	var queryText = "UPDATE tbl_corporate_email_list SET deleted = 0 WHERE unsubscribe_guid = @unsubscribe_guid";

	sqlReq.query(queryText, (err, result) => {
		if (err){
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
			return;
		} else if (result.rowsAffected != 0){
			res.status(200).send("Resubscribed successfully!");
			return;
		} else {
			res.status(400).send("We were unable to process your request, please contact us to resolve this issue.");
		}
	});
});

router.get("/terms-and-conditions", function(req, res){
	res.render("terms-and-conditions");
});

router.get("/privacy-policy", function(req, res){
	res.render("privacy-policy");
});

router.get('/sitemap.xml', function(req, res) {
	res.sendFile(path.join(__dirname, '../sitemap.xml'));
});

router.get('/robots.txt', function(req, res) {
	res.sendFile(path.join(__dirname, '../robots.txt'));
});

module.exports = router;
