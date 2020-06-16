var aws       = require('aws-sdk'),
    path      = require('path'),
    sql       = require('mssql'),
    mailerObj = {};

aws.config.loadFromPath(path.join(__dirname, '../config.json'));
var ses = new aws.SES();

mailerObj.sendContactUsEmailGen = function(formData){
  var content = "<p><b>Name:</b> " + formData.txtNameGen + "</p>";
  content    += "<p><b>Email:</b> " + formData.txtEmailGen + "</p>";
  content    += "<p><b>Subject:</b> " + formData.ddlSubjectGen + "</p>";
  content    += "<p><b>Comments:</b></p><p>" + formData.txtCommentsGen + "</p>";

  content = content.replace(/(?:\r\n|\r|\n)/g, '<br>');

  var params = {
    Destination: {
      BccAddresses: [
        'aggiedevelopers@gmail.com',
      ],
      ToAddresses: []
    },
    Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
    Template: "AWD-Contact-Us-Notification-Template",
    TemplateData: "{ \"title\": \"New General Contact Us Submission\", \"content\": \"" + content.replace("\n", "< /br>") + "\" }",
    ReplyToAddresses: [
       'no-reply@aggiedevelopers.com',
    ],
  };

  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

  sendPromise.then(
    function(data) {}).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

mailerObj.sendContactUsEmailCorp = function(formData){
  var content = "<p><b>Name:</b> " + formData.txtNameCorp + "</p>";
  content    += "<p><b>Email:</b> " + formData.txtEmailCorp + "</p>";
  content    += "<p><b>Company:</b> " + formData.txtCorp + "</p>";
  content    += "<p><b>Subject:</b> " + formData.ddlSubjectCorp + "</p>";
  content    += "<p><b>Comments:</b></p><p>" + formData.txtCommentsCorp + "</p>";

  content = content.replace(/(?:\r\n|\r|\n)/g, '<br>');

  var params = {
    Destination: {
      BccAddresses: [
        'aggiedevelopers@gmail.com',
      ],
      ToAddresses: []
    },
    Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
    Template: "AWD-Contact-Us-Notification-Template",
    TemplateData: "{ \"title\": \"New Corporate Contact Us Submission\", \"content\": \"" + content.replace("\n", "< /br>") + "\" }",
    ReplyToAddresses: [
       'no-reply@aggiedevelopers.com',
    ],
  };

  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

  sendPromise.then(
    function(data) {}).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

mailerObj.sendAdminEmail = async function(id){
  let email = await getEmailById(id);
  var destinations = [];

  if (email.recip_type == "All") {
      let generalRecipeints = await getGeneralRecipeints();
      let corporateRecipeints = await getCorporateRecipeints();

      generalRecipeints.forEach(function(recip){
        var destination = {};
        var toAddress = {};

        toAddress["ToAddresses"] = [recip.email];

        destination["Destination"] = toAddress;
        destination["ReplacementTemplateData"] = "{ \"unsubscribe\":\"general/" + recip.unsubscribe_guid + "\" }";
        destinations.push(destination);
      });

      corporateRecipeints.forEach(function(recip){
        var destination = {};
        var toAddress = {};

        toAddress["ToAddresses"] = [recip.email];

        destination["Destination"] = toAddress;
        destination["ReplacementTemplateData"] = "{ \"unsubscribe\":\"corporate/" + recip.unsubscribe_guid + "\" }";
        destinations.push(destination);
      });
  } else if (email.recip_type == "Corporate") {
      let corporateRecipeints = await getCorporateRecipeints();

      corporateRecipeints.forEach(function(recip){
        var destination = {};
        var toAddress = {};

        toAddress["ToAddresses"] = [recip.email];

        destination["Destination"] = toAddress;
        destination["ReplacementTemplateData"] = "{ \"unsubscribe\":\"corporate/" + recip.unsubscribe_guid + "\" }";
        destinations.push(destination);
      });
  } else if (email.recip_type == "General"){
  	  let generalRecipeints = await getGeneralRecipeints();

      generalRecipeints.forEach(function(recip){
        var destination = {};
        var toAddress = {};

        toAddress["ToAddresses"] = [recip.email];

        destination["Destination"] = toAddress;
        destination["ReplacementTemplateData"] = "{ \"unsubscribe\":\"general/" + recip.unsubscribe_guid + "\" }";
        destinations.push(destination);
      });
  }

  var params = {
    Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
    Template: "AWD-General-Email-Template",
    DefaultTemplateData: "{\"Subject\": \"" + email.subject +"\", \"title\": \"" + email.subject + "\", \"content\": \"" + email.body.replace(/"/g, '\'') + "\"}",
    ReplyToAddresses: [
       'aggiedevelopers@gmail.com',
    ],
    Destinations: destinations
  };

  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendBulkTemplatedEmail(params).promise();

  return new Promise((resolve, reject) => {
  	sendPromise.then(async function(data) {
	    let emailSentStatus = await markEmailSent(email.id);
	    resolve(emailSentStatus);
	  }).catch( function(err) {
	      reject(err);
	  });
  });
}

function getEmailById(id) { 
  return new Promise((resolve, reject) => {
    var sqlReq = new sql.Request().input("id", sql.Int, id);

    sqlReq.query("SELECT TOP 1 * FROM tbl_emails WHERE id = @id AND sent_date is NULL", (err, result) => {
        if (err) reject(err); 
        resolve(result.recordset[0]);
    });
  });
}

function getGeneralRecipeints() { 
  return new Promise((resolve, reject) => {
    var sqlReq = new sql.Request().query("SELECT email, unsubscribe_guid FROM tbl_email_list WHERE deleted = 0", (err, result) => {
        if (err) reject(err); 
        resolve(result.recordset);
    });
  });
}

function getCorporateRecipeints() { 
  return new Promise((resolve, reject) => {
	var sqlReq = new sql.Request().query("SELECT email, unsubscribe_guid FROM tbl_corporate_email_list WHERE deleted = 0", (err, result) => {
        if (!err){
        	resolve(result.recordset);
        } else {
        	reject("Error getting recipients.");
        }
    });
  });
}

function markEmailSent(id) { 
  return new Promise((resolve, reject) => {
    var sqlReq = new sql.Request().input("id", sql.Int, id).query("UPDATE tbl_emails SET sent_date = GETUTCDATE() WHERE id = @id", (err, result) => {
        if (err) reject(err); 
        resolve("Success");
    });
  });
}

module.exports = mailerObj;