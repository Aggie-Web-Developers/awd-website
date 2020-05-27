var aws       = require('aws-sdk'),
    path      = require('path'),
    mailerObj = {};

aws.config.loadFromPath(path.join(__dirname, '../config.json'));
var ses = new aws.SES();

mailerObj.sendContactUsEmailGen = function(formData){
  var params = {
    Destination: {
      BccAddresses: [
        'aggiedevelopers@gmail.com',
      ],
      ToAddresses: []
    },
    Message: {
      Body: {
        Html: {
         Charset: "UTF-8",
         Data: 'New General Contact Us Form Submitted.'
        },
        Text: {
         Charset: "UTF-8",
         Data: 'New General Contact Us Form Submitted.'
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'New General Contact Us Form'
       }
      },
    Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
    ReplyToAddresses: [
       'no-reply@aggiedevelopers.com',
    ],
  };

  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  sendPromise.then(
    function(data) {}).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

mailerObj.sendContactUsEmailCorp = function(formData){
  var params = {
    Destination: {
      BccAddresses: [
        'aggiedevelopers@gmail.com',
      ],
      ToAddresses: []
    },
    Message: {
      Body: {
        Html: {
         Charset: "UTF-8",
         Data: 'New Corporate Contact Us Form Submitted'
        },
        Text: {
         Charset: "UTF-8",
         Data: 'New Corporate Contact Us Form Submitted'
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'New Corporate Contact Us Form Submitted'
       }
      },
    Source: 'Aggie Web Developers <no-reply@aggiedevelopers.com>',
    ReplyToAddresses: [
       'no-reply@aggiedevelopers.com',
    ],
  };

  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  sendPromise.then(
    function(data) {}).catch(
      function(err) {
      console.error(err, err.stack);
    });
}

module.exports = mailerObj;