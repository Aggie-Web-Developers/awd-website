$(function () {
    document.title = 'Portal - Register';

    jQuery.validator.addMethod("strongpassword", function (value, element) {
       return this.optional(element) || /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{12})/.test(value);
    }, "Your password must include 12 characters, a character of each case, a number, and a special character.");


    $("#frm").validate({
        rules: {
            txtFirstName: { required: true },
            txtLastName: { required: true },
            txtEmailAddress: { required: true, email: true },
            chkTerms: { required: true },
            txtPassword: { required: true, strongpassword: true },
            txtConfirmPassword: { required: true, equalTo: "#txtPassword" } 
        },
        messages: {
            txtPassword: {
                required: ' Please enter a password.',
                strongpassword: 'Your password must include 12 characters, a character of each case, a number, and a special character.',
            },
            txtConfirmPassword: {
                required: ' Please confirm your password.',
                equalTo: ' Your passwords do not match.'
            },
            txtFirstName: { required: 'Please enter your first name.' },
            txtLastName: { required: 'Please enter your last name.' },
            txtEmailAddress: { required: 'Please enter your email address.' },
            chkTerms: { required: 'You must agree to our terms and conditions.' },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.closest('.form-group'));
        }
    });

    $('.alert').click(function() {
        $(this).hide();
    });
});