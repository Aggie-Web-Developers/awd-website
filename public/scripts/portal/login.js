// JS File for Portal Login View

$(function () {
	document.title = 'Portal - Login';

	$("#frm").validate({
        ignore: ":hidden",
        rules: {
            email: { required: true, email: true },
            password: { required: true },
        },
        messages: {
            email: { required: 'Please enter your email address.' },
            password: { required: 'Please enter you password.' }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.form-group'));
        }
    });

    $('.alert').click(function() {
		$(this).hide();
	});
});
