const aws = require('aws-sdk');
const path = require('path');
const sql = require('mssql');
const schedule = require('node-schedule');
const mailerObj = {};

aws.config.accessKeyId = process.env.accessKeyId;
aws.config.secretAccessKey = process.env.secretAccessKey;
aws.config.region = process.env.region;

const ses = new aws.SES();

// sends an email to the org email when an error occurs
mailerObj.sendErrorEmail = async function (err) {
	const siteType = process.env.NODE_ENV == 'prod' ? 'Production' : 'Dev';

	let content = '<p><b>Error:</b> ' + err + '</p>';
	content = content.replace(/"/g, "'").replace(/(?:\r\n|\r|\n)/g, ''); // make content string safe for template data

	const params = {
		Destination: {
			BccAddresses: [],
			ToAddresses: ['cdconn00@gmail.com'],
		},
		Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
		Template: 'AWD-Error-Email', // template name **CHANGE??**
		TemplateData:
			'{ "Subject": "ERROR: AWD SITE - ' +
			siteType +
			'", "content": "' +
			content +
			'"}',
		ReplyToAddresses: ['cdconn00@gmail.com'],
	};

	const sendPromise = new aws.SES({ apiVersion: '2010-12-01' })
		.sendTemplatedEmail(params)
		.promise();

	return new Promise((resolve, reject) => {
		sendPromise
			.then(async function (data) {
				resolve('Success');
			})
			.catch(function (err) {
				console.log(err);
				resolve('Error');
			});
	});
};

mailerObj.sendContactUsEmailGen = async function (formData) {
	let content = '<p><b>Name:</b> ' + formData.txtNameGen + '</p>';
	content += '<p><b>Email:</b> ' + formData.txtEmailGen + '</p>';
	content += '<p><b>Subject:</b> ' + formData.ddlSubjectGen + '</p>';
	content += '<p><b>Comments:</b></p><p>' + formData.txtCommentsGen + '</p>';

	content = content.replace(/"/g, "'").replace(/(?:\r\n|\r|\n)/g, '');

	const params = {
		Destination: {
			BccAddresses: ['aggiedevelopers@gmail.com'],
			ToAddresses: [],
		},
		Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
		Template: 'AWD-Contact-Us-Notification-Template',
		TemplateData:
			'{ "title": "New General Contact Us Submission", "content": "' +
			content +
			'" }',
		ReplyToAddresses: ['no-reply@aggiedevelopers.com'],
	};

	const sendPromise = new aws.SES({ apiVersion: '2010-12-01' })
		.sendTemplatedEmail(params)
		.promise();

	return new Promise((resolve, reject) => {
		sendPromise
			.then(async function (data) {
				resolve('Success');
			})
			.catch(function (err) {
				console.error(err);
				resolve('Error');
			});
	});
};

mailerObj.sendContactUsEmailCorp = async function (formData) {
	let content = '<p><b>Name:</b> ' + formData.txtNameCorp + '</p>';
	content += '<p><b>Email:</b> ' + formData.txtEmailCorp + '</p>';
	content += '<p><b>Company:</b> ' + formData.txtCorp + '</p>';
	content += '<p><b>Subject:</b> ' + formData.ddlSubjectCorp + '</p>';
	content += '<p><b>Comments:</b></p><p>' + formData.txtCommentsCorp + '</p>';

	content = content.replace(/"/g, "'").replace(/(?:\r\n|\r|\n)/g, '');

	const params = {
		Destination: {
			BccAddresses: ['aggiedevelopers@gmail.com'],
			ToAddresses: [],
		},
		Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
		Template: 'AWD-Contact-Us-Notification-Template',
		TemplateData:
			'{ "title": "New Corporate Contact Us Submission", "content": "' +
			content +
			'" }',
		ReplyToAddresses: ['no-reply@aggiedevelopers.com'],
	};

	const sendPromise = new aws.SES({ apiVersion: '2010-12-01' })
		.sendTemplatedEmail(params)
		.promise();

	return new Promise((resolve, reject) => {
		sendPromise
			.then(async function (data) {
				resolve('Success');
			})
			.catch(function (err) {
				console.error(err);
				resolve('Error');
			});
	});
};

mailerObj.sendAdminEmail = async function (id) {
	const email = await getEmailById(id);
	const destinations = [];
	const sendList = [];

	if (email == 'Error') {
		return new Promise((resolve, reject) => {
			resolve('Email failed to send. Error retrieving email.');
		});
	}

	if (email.recip_type == 'All') {
		const generalRecipeints = await getGeneralRecipeints();
		const corporateRecipeints = await getCorporateRecipeints();

		if (generalRecipeints == 'Error' || corporateRecipeints == 'Error') {
			return new Promise((resolve, reject) => {
				resolve('Email failed to send. Error retrieving email.');
			});
		}

		generalRecipeints.forEach(function (recip) {
			const destination = {};
			const toAddress = {};

			toAddress['ToAddresses'] = [recip.email];

			destination['Destination'] = toAddress;
			destination['ReplacementTemplateData'] =
				'{ "unsubscribe":"general/' + recip.unsubscribe_guid + '" }';
			destinations.push(destination);
		});

		corporateRecipeints.forEach(function (recip) {
			const destination = {};
			const toAddress = {};

			toAddress['ToAddresses'] = [recip.email];

			destination['Destination'] = toAddress;
			destination['ReplacementTemplateData'] =
				'{ "unsubscribe":"corporate/' + recip.unsubscribe_guid + '" }';
			destinations.push(destination);
		});
	} else if (email.recip_type == 'Corporate') {
		const corporateRecipeints = await getCorporateRecipeints();

		if (corporateRecipeints == 'Error') {
			return new Promise((resolve, reject) => {
				resolve('Email failed to send. Error retrieving email.');
			});
		}

		corporateRecipeints.forEach(function (recip) {
			const destination = {};
			const toAddress = {};

			toAddress['ToAddresses'] = [recip.email];

			destination['Destination'] = toAddress;
			destination['ReplacementTemplateData'] =
				'{ "unsubscribe":"corporate/' + recip.unsubscribe_guid + '" }';
			destinations.push(destination);
		});
	} else if (email.recip_type == 'General') {
		const generalRecipeints = await getGeneralRecipeints();

		if (generalRecipeints == 'Error') {
			return new Promise((resolve, reject) => {
				resolve('Email failed to send. Error retrieving email.');
			});
		}

		generalRecipeints.forEach(function (recip) {
			const destination = {};
			const toAddress = {};

			toAddress['ToAddresses'] = [recip.email];

			destination['Destination'] = toAddress;
			destination['ReplacementTemplateData'] =
				'{ "unsubscribe":"general/' + recip.unsubscribe_guid + '" }';
			destinations.push(destination);
		});
	}

	// SES only allows 50 destinations at a time, so we must split the destinations array into smaller arrays
	while (destinations.length > 0) sendList.push(destinations.splice(0, 45));

	return new Promise(async (resolve, reject) => {
		const success = await attemptSend(email, sendList);

		if (success) {
			const markedSent = await markEmailSent(email.id);

			if (markedSent) resolve('Success');
			else resolve('Email failed to send.');
		} else {
			resolve('Email failed to send.');
		}
	});
};

mailerObj.sendTestEmail = async function (id) {
	const email = await getEmailById(id);
	const destinations = [];
	const sendList = [];
	const destination = {};
	const toAddress = {};

	if (email == 'Error') {
		return new Promise((resolve, reject) => {
			resolve('Email failed to send. Error retrieving email.');
		});
	}

	email.subject = 'TEST: ' + email.subject;

	toAddress['ToAddresses'] = [
		'anguyen120@tamu.edu',
		'aggiedevelopers@gmail.com',
	];

	destination['Destination'] = toAddress;

	destination['ReplacementTemplateData'] =
		'{ "unsubscribe":"general/' + '' + '" }';

	destinations.push(destination);

	// SES only allows 50 destinations at a time, so we must split the destinations array into smaller arrays
	while (destinations.length > 0) sendList.push(destinations.splice(0, 45));

	return new Promise(async (resolve, reject) => {
		const success = await attemptSend(email, sendList);

		if (success) {
			resolve('Success');
		} else {
			resolve('Email failed to send.');
		}
	});
};

async function attemptSend(email, sendList) {
	const promises = sendList.map(async function (recips) {
		return await sendBulkMail(email, recips);
	});

	return new Promise(async (resolve, reject) => {
		await Promise.all(promises)
			.then(function () {
				resolve(true);
			})
			.catch((err) => {
				console.error(err);
				resolve(false);
			});
	});
}

async function sendBulkMail(email, recips) {
	const params = {
		Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
		Template: 'AWD-Branded-Email-Template',
		DefaultTemplateData:
			'{"Subject": "' +
			email.subject +
			'", "content": "' +
			email.body.replace(/"/g, "'").replace(/(?:\r\n|\r|\n)/g, '') +
			'"}',
		ReplyToAddresses: ['aggiedevelopers@gmail.com'],
		Destinations: recips,
	};

	const sendPromise = new aws.SES({ apiVersion: '2010-12-01' })
		.sendBulkTemplatedEmail(params)
		.promise();

	return new Promise((resolve, reject) => {
		sendPromise
			.then(function (data) {
				if (data.Status[0].Error) throw data.Status[0];
				else resolve('Success');
			})
			.catch(function (err) {
				console.log(err);
				reject(new Error(err));
			});
	});
}

mailerObj.listenForScheduledEmails = function () {
	// listen for emails to be sent every hour at the fifth minute
	schedule.scheduleJob('5 * * * *', function () {
		const sqlReq = new sql.Request()
			.query(
				'SELECT id FROM tbl_emails WHERE send_date <= GETUTCDATE() AND sent_date is NULL AND deleted = 0'
			)
			.then((result) => {
				result.recordset.forEach(async function (result) {
					const emailStatus = await mailerObj.sendAdminEmail(result.id);

					if (emailStatus != 'Success') {
						console.log('Error sending schedule email: ID: ' + result.id);
					}
				});
			})
			.catch((err) => {
				console.error(err);
				console.log('Error sending scheduled emails.');
			});
	});
};

function getEmailById(id) {
	return new Promise((resolve, reject) => {
		const sqlReq = new sql.Request().input('id', sql.Int, id);

		sqlReq
			.query(
				'SELECT TOP 1 * FROM tbl_emails WHERE id = @id AND sent_date is NULL'
			)
			.then((result) => {
				resolve(result.recordset[0]);
			})
			.catch((err) => {
				console.error(err);
				resolve('Error');
			});
	});
}

function getGeneralRecipeints() {
	return new Promise((resolve, reject) => {
		const sqlReq = new sql.Request()
			.query(
				'SELECT email, unsubscribe_guid FROM tbl_email_list WHERE deleted = 0'
			)
			.then((result) => {
				resolve(result.recordset);
			})
			.catch((err) => {
				console.log(err);
				resolve('Error');
			});
	});
}

function getCorporateRecipeints() {
	return new Promise((resolve, reject) => {
		const sqlReq = new sql.Request()
			.query(
				'SELECT email, unsubscribe_guid FROM tbl_corporate_email_list WHERE deleted = 0'
			)
			.then((result) => {
				resolve(result.recordset);
			})
			.catch((err) => {
				console.error(err);
				resolve('Error');
			});
	});
}

function markEmailSent(id) {
	return new Promise((resolve, reject) => {
		const sqlReq = new sql.Request()
			.input('id', sql.Int, id)
			.query('UPDATE tbl_emails SET sent_date = GETUTCDATE() WHERE id = @id')
			.then((result) => {
				resolve(true);
			})
			.catch((err) => {
				console.error(err);
				resolve(false);
			});
	});
}

module.exports = mailerObj;
