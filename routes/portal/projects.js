var express    = require("express"),
    router     = express.Router(),
    flash      = require('express-flash'),
    sql        = require('mssql'),
    middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().query("SELECT * FROM tbl_projects ORDER BY create_date ASC").then(result => {
		res.render('portal/projects/index', { projects: result.recordset });
	}).catch(err => {
		req.flash("error", "Error loading projects.");
		res.render('portal/projects/index', { projects: [] });
	});
});

router.get('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request().input("id", sql.Int, req.params.id).query("SELECT TOP 1 * FROM tbl_projects WHERE id = @id")
		.then(result => {
			if (result.recordset.length > 0) {
				res.render('portal/projects/edit', { project: result.recordset[0] });
			} else {
				req.flash("error", "Error project does not exist.");
				res.redirect("/portal/projects/");
			}
		}).catch(err => {
			req.flash("error", "Error loading project.");
			res.redirect("/portal/projects/");
	});
});

router.put('/edit/:id', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();
	var sqlQuery = "UPDATE tbl_projects " +
			       "SET name = @name, work_done = @work_done, status = @status, manager = @manager, test_url = @test_url, github_url = @github_url, " +
			       "start_date = @start_date, deleted = @deleted, image_url = @image_url WHERE id=@id";

	sqlReq.input("id", sql.Int, req.params.id);
	sqlReq.input("name", sql.NVarChar, req.body.txtName);
	sqlReq.input("work_done", sql.NVarChar, req.body.txtWork);
	sqlReq.input("status", sql.NVarChar, req.body.txtStatus);
	sqlReq.input("manager", sql.NVarChar, req.body.txtManager);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("image_url", sql.NVarChar, req.body.txtImageLink);
	sqlReq.input("test_url", sql.NVarChar, req.body.txtTestLink);
	sqlReq.input("github_url", sql.NVarChar, req.body.txtGithub);
	sqlReq.input("start_date", sql.NVarChar, req.body.txtDate);

	sqlReq.query(sqlQuery)
		.then(result => {
			if (result.rowsAffected == 0){
				req.flash("error", "Error updating project.");
				res.redirect("/portal/projects/");
			} else {
				req.flash("success", "Success! Project updated.");
				res.redirect("/portal/projects/");
			}
		}).catch(err => {
			req.flash("error", "Error updating project.");
			res.redirect("/portal/projects/");
	});
});

router.get('/new', middleware.checkAuthenticated, function(req, res) {
	res.render("portal/projects/new");
});

router.post('/new', middleware.checkAuthenticated, function(req, res) {
	var sqlReq = new sql.Request();
	
	var sqlQuery = "INSERT INTO tbl_projects (name, work_done, status, manager, test_url, github_url, start_date, deleted, image_url) VALUES " +
			        "(@name, @work_done, @status, @manager, @test_url, @github_url, @start_date, @deleted,  @image_url)";

	sqlReq.input("id", sql.Int, req.params.id);
	sqlReq.input("name", sql.NVarChar, req.body.txtName);
	sqlReq.input("work_done", sql.NVarChar, req.body.txtWork);
	sqlReq.input("status", sql.NVarChar, req.body.txtStatus);
	sqlReq.input("manager", sql.NVarChar, req.body.txtManager);
	sqlReq.input("deleted", sql.Bit, req.body.chkDeleted === "on");
	sqlReq.input("image_url", sql.NVarChar, req.body.txtImageLink);
	sqlReq.input("test_url", sql.NVarChar, req.body.txtTestLink);
	sqlReq.input("github_url", sql.NVarChar, req.body.txtGithub);
	sqlReq.input("start_date", sql.NVarChar, req.body.txtDate);

	sqlReq.query(sqlQuery)
		.then(result => {
			if (result.rowsAffected == 0){
				req.flash("error", "Error creating project.");
				res.redirect("/portal/projects/");
			} else {
				req.flash("success", "Success! Project created.");
			res.redirect("/portal/projects/");
			}
		}).catch(err => {
			req.flash("error", "Error creating project.");
				res.redirect("/portal/projects/");
	});
});

module.exports = router;
