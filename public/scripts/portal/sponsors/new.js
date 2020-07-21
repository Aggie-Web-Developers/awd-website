// JS File for Portal Sponsor New View

$(function () {
	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtName: { required: true, maxlength: 50 },
			txtReferLink: { required: true, maxlength: 100 },
			txtImageLink: { required: true, maxlength: 500 },
			txtDate: { required: true },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
