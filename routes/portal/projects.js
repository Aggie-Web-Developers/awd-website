var express = require('express'),
	router = express.Router(),
	flash = require('express-flash'),
	sql = require('mssql'),
	middleware = require('../../middleware');

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var queryText = ' SELECT * FROM tbl_projects ORDER BY create_date ASC';

	var sqlReq = new sql.Request().query(queryText, (err, result) => {
		if (err) {
			console.log(err);
			req.flash('error', 'Error loading projects.');
		} else {
			res.render('portal/projects/index', { projects: result.recordset });
		}
	});
});

router.get('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.params.id)
		.query('SELECT TOP 1 * FROM tbl_projects WHERE id = @id', (err, result) => {
			if (err) {
				req.flash('error', 'Error loading projects.');
				res.redirect('/portal/projects/');
			} else {
				res.render('portal/projects/edit', { project: result.recordset[0] });
			}
		});
});

router.put('/edit/:id', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();
	var queryText =
		'UPDATE tbl_projects ' +
		'SET name = @name, work_done = @work_done, status = @status, manager = @manager, test_url = @test_url, github_url = @github_url, ' +
		'start_date = @start_date, deleted = @deleted, image_url = @image_url WHERE id=@id';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('work_done', sql.NVarChar, req.body.txtWork);
	sqlReq.input('status', sql.NVarChar, req.body.txtStatus);
	sqlReq.input('manager', sql.NVarChar, req.body.txtManager);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('test_url', sql.NVarChar, req.body.txtTestLink);
	sqlReq.input('github_url', sql.NVarChar, req.body.txtGithub);
	sqlReq.input('start_date', sql.NVarChar, req.body.txtDate);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0) {
			console.log(err);
			req.flash('error', 'Error updating project.');
		} else {
			req.flash('success', 'Success! Project updated.');
			res.redirect('/portal/projects/');
		}
	});
});

router.get('/new', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/projects/new');
});

router.post('/new', middleware.checkAuthenticated, function (req, res) {
	var sqlReq = new sql.Request();

	var queryText =
		'INSERT INTO tbl_projects (name, work_done, status, manager, test_url, github_url, start_date, deleted, image_url) VALUES ' +
		'(@name, @work_done, @status, @manager, @test_url, @github_url, @start_date, @deleted,  @image_url)';

	sqlReq.input('id', sql.Int, req.params.id);
	sqlReq.input('name', sql.NVarChar, req.body.txtName);
	sqlReq.input('work_done', sql.NVarChar, req.body.txtWork);
	sqlReq.input('status', sql.NVarChar, req.body.txtStatus);
	sqlReq.input('manager', sql.NVarChar, req.body.txtManager);
	sqlReq.input('deleted', sql.Bit, req.body.chkDeleted === 'on');
	sqlReq.input('image_url', sql.NVarChar, req.body.txtImageLink);
	sqlReq.input('test_url', sql.NVarChar, req.body.txtTestLink);
	sqlReq.input('github_url', sql.NVarChar, req.body.txtGithub);
	sqlReq.input('start_date', sql.NVarChar, req.body.txtDate);

	sqlReq.query(queryText, (err, result) => {
		if (err || result.rowsAffected == 0) {
			console.log(err);
			req.flash('error', 'Error creating project.');
		} else {
			req.flash('success', 'Success! Project created.');
			res.redirect('/portal/projects/');
		}
	});
});

module.exports = router;
