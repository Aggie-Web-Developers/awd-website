const express = require('express');
const router = express.Router();
const sql = require('mssql');
const middleware = require('../../middleware');
const AWS = require('aws-sdk');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

// Create Multer instance that stores file in buffer
const upload = multer();

router.get('/', middleware.checkAuthenticated, function (req, res) {
	var sqlQuery =
		'SELECT tbl_officer_positions.name FROM tbl_user INNER JOIN tbl_officer_positions ON tbl_user.officer_id = tbl_officer_positions.id WHERE tbl_user.id = @id;';

	var sqlReq = new sql.Request()
		.input('id', sql.Int, req.user.id)
		.query(sqlQuery)
		.then((result) => {
			res.render('portal/profile', {
				user_position: result.recordset[0].name,
			});
		})
		.catch((err) => {
			res.render('portal/profile', { user_position: 'Member' });
		});
});

router.get('/edit', middleware.checkAuthenticated, function (req, res) {
	res.render('portal/profile/edit');
});

router.put('/edit', upload.single('fileProfilePicture'), async function (
	req,
	res
) {
	var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

	var uploaded = { Location: null };

	if (req.file) {
		// Create a random (version 4) UUID to use as image name
		var filename = uuidv4(); // TODO: add file extensions to the end of the filename (i didnt know it worked without this, but just ic case [i.e. 23187sdhagdg213easj.png])

		AWS.config.update({
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			region: process.env.S3_REGION,
		});

		var uploadParams = {
			Bucket: 'awd-site-dev',
			Key: filename,
			Body: req.file.buffer,
			ContentType: 'image/png', // TODO: this should be image/ the image type, ie image/jpg, image/bmp. We should be able to get this infor from multer
		};

		// Upload image to S3 bucket, receive the URL it's stored at
		uploaded = await s3.upload(uploadParams).promise();
	}

	// Delete user's previous profile picture from bucket
	var previousURL = req.user.image_url;
	if (previousURL) {
		// Retrieve object key from end of image's URL
		var previousKey = previousURL.substring(previousURL.lastIndexOf('/') + 1);

		var deleteParams = {
			Bucket: 'awd-site-dev',
			Key: previousKey,
		};

		s3.deleteObject(deleteParams); // TODO: this may need to be awaited and have a .promise() callback to work, I dont think it is working right now
	}

	var sqlReq = new sql.Request();
	var sqlQuery =
		'UPDATE tbl_user ' +
		'SET first_name = @first_name, last_name = @last_name, email = @email, website = @website, image_url = @image_url WHERE id = @id';

	sqlReq.input('id', sql.Int, req.user.id);
	sqlReq.input('first_name', sql.NVarChar, req.body.txtUserFirstName);
	sqlReq.input('last_name', sql.NVarChar, req.body.txtUserLastName);
	sqlReq.input('email', sql.NVarChar, req.body.txtUserEmail);
	sqlReq.input('website', sql.NVarChar, req.body.txtUserWebsite);
	sqlReq.input('image_url', sql.NVarChar, uploaded.Location);

	sqlReq
		.query(sqlQuery)
		.then((result) => {
			if (result.rowsAffected == 0) {
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

module.exports = router;
