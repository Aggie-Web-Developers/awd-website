var aws       = require('aws-sdk'),
    path      = require('path'),
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

module.exports = mailerObj;