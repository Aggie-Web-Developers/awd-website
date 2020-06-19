var express    = require("express"),
    router     = express.Router(),
    flash      = require('express-flash'),
    sql        = require('mssql'),
    middleware = require('../../middleware'),
    moment     = require('moment')
    tz     = require('moment-timezone');

router.get('/', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().query("SELECT e.*, em.id as email_id FROM tbl_events e LEFT JOIN tbl_emails em ON em.event_id = e.id ORDER BY e.deleted ASC, e.start_date ASC", (err, result) => {
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

router.get('/createEmail/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().input("id", sql.Int, req.params.id).query("SELECT TOP 1 * FROM tbl_events WHERE id = @id", (err, result) => {
		if (err){
			req.flash("error", "Error creating event email.");
			res.redirect("/portal/events/");
		} else {
			var event = result.recordset[0],
				eventTime = moment(event.event_time).tz('America/Chicago').format('dddd, MMMM Do, h:MM A z'),
				body = '',
				queryText = "INSERT INTO tbl_emails " +
					        "(subject, recip_type, body, sending_user_id, event_id) values " +
				     	    "(@subject, @recip_type, @body, @sending_user_id, @event_id) ";

     	    if (event.type != "News"){
     	    	body = "<p>Howdy Developers,</p><p>We have scheduled a new " + event.type + " event for " + eventTime + 
     	    	       ". See the event information below:</p><p><b>" + event.name + "</b> - " + eventTime + " - " + event.location + "</p>" +
     	    	       "<p>" + event.descr + "</p><p>We hope to see you there!</p>";
     	    } else {
     	    	body = "<p>Howdy Developers,</p><p>" + event.descr + "</p>";
     	    }

			sqlReq.input("subject", sql.NVarChar, event.name);
			sqlReq.input("recip_type", sql.NVarChar, "General");
			sqlReq.input("body", sql.NVarChar, body);
			sqlReq.input("event_id", sql.Int, req.params.id);
			sqlReq.input("sending_user_id", sql.Int, req.user.id);

			sqlReq.query(queryText, (err, result) => {
				if (err || result.rowsAffected == 0){
					console.log(err)
					req.flash("error", "Error creating event email.");
					res.redirect("/portal/events/");
				} else {
					req.flash("success", "Success! Event email created.");
					res.redirect("/portal/emails/");
				}
			});
		}
	});
});

module.exports = router;
