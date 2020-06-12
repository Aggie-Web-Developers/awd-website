var express    = require("express"),
    router     = express.Router(),
    flash      = require('express-flash'),
    sql        = require('mssql'),
    middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().query("SELECT * FROM tbl_events ORDER BY deleted ASC, start_date ASC", (err, result) => {
		if (err){
			console.log(err)
			req.flash("error", "Error loading events.");
		} else {
			res.render('portal/events/index', { events: result.recordset });
		}
	});
});

router.get('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().input("id", sql.Int, req.params.id).query("SELECT TOP 1 * FROM tbl_events WHERE id = @id", (err, result) => {
		if (err){
			req.flash("error", "Error loading event.");
			res.redirect("/portal/events/");
		} else {
			res.render('portal/events/edit', { event: result.recordset[0] });
		}
	});
});

router.put('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();

	var user_date = new Date(req.body.txtDate + " " + req.body.txtTime);
	var converted_date = new Date(user_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	var user_start_date = new Date(req.body.txtStartDate);
	var converted_start_date = new Date(user_start_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	var user_end_date = new Date(req.body.txtEndDate);
	var converted_end_date = new Date(user_end_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	sqlReq.input("id", sql.Int, req.params.id);
	sqlReq.input("name", sql.NVarChar, req.body.txtEventName);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("type", sql.NVarChar, req.body.ddlEventType);
	sqlReq.input("event_time", sql.NVarChar, converted_date);
	sqlReq.input("summary", sql.NVarChar, req.body.txtEventSubTitle);
	sqlReq.input("descr", sql.NVarChar, req.body.txtDescr);
	sqlReq.input("start_date", sql.NVarChar, converted_start_date);
	sqlReq.input("end_date", sql.NVarChar, converted_end_date);
	sqlReq.input("location", sql.NVarChar, req.body.txtLocation);
	sqlReq.input("image_link", sql.NVarChar, req.body.txtImage);
	sqlReq.input("creating_user_id", sql.Int, req.user.id);

	var queryText = "UPDATE tbl_events SET " +
					"name = @name, deleted = @deleted, type = @type, event_time = @event_time, summary= @summary, descr = @descr, start_date = @start_date, " + 
					"end_date = @end_date, location= @location, image_link = @image_link, creating_user_id = @creating_user_id " +
					"WHERE id = @id";

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0){
			console.log(err)
			req.flash("error", "Error updating event.");
			res.redirect("/portal/events/");
		} else {
			req.flash("success", "Success! Event updated.");
			res.redirect("/portal/events/");
		}
	});
});

router.get('/new', middleware.checkAuthenticated, function(req, res) {
	res.render("portal/events/new");
});

router.post('/new', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();

	var user_date = new Date(req.body.txtDate + " " + req.body.txtTime);
	var converted_date = new Date(user_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	var user_start_date = new Date(req.body.txtStartDate);
	var converted_start_date = new Date(user_start_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	var user_end_date = new Date(req.body.txtEndDate);
	var converted_end_date = new Date(user_end_date.getTime()).toISOString().slice(0, 19).replace('T', ' ');

	sqlReq.input("name", sql.NVarChar, req.body.txtEventName);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("type", sql.NVarChar, req.body.ddlEventType);
	sqlReq.input("event_time", sql.NVarChar, converted_date);
	sqlReq.input("summary", sql.NVarChar, req.body.txtEventSubTitle);
	sqlReq.input("descr", sql.NVarChar, req.body.txtDescr);
	sqlReq.input("start_date", sql.NVarChar, converted_start_date);
	sqlReq.input("end_date", sql.NVarChar, converted_end_date);
	sqlReq.input("location", sql.NVarChar, req.body.txtLocation);
	sqlReq.input("image_link", sql.NVarChar, req.body.txtImage);
	sqlReq.input("creating_user_id", sql.Int, req.user.id);



	var queryText = "INSERT INTO tbl_events " +
					"(name, deleted, type, event_time, summary, descr, start_date, end_date, location, image_link, creating_user_id) values " +
					"(@name, @deleted, @type, @event_time, @summary, @descr, @start_date, @end_date, @location, @image_link, @creating_user_id) ";

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0){
			console.log(err)
			req.flash("error", "Error creating event.");
		} else {
			req.flash("success", "Success! Event created.");
			res.redirect("/portal/events/");
		}
	});
});

module.exports = router;
