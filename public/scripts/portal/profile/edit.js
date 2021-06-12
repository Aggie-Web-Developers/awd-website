// JS File for Member Profile Edit View

$(function () {
	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtUserFirstName: { required: true, maxlength: 50 },
			txtUserLastName: { required: true, maxlength: 50 },
			txtUserEmail: { required: true, email: true, maxlength: 100 },
			txtUserWebsite: { required: false, maxlength: 250 },
		},
        messages: {
			txtUserEmail: { email: 'Please enter a valid email address' },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
