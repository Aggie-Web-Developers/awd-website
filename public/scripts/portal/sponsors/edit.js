// JS File for Portal Sponsor Edit View

$(function () {
	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtName: { required: true },
			txtReferLink: { required: true },
			txtImageLink: { required: true },
			txtDate: { required: true },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
