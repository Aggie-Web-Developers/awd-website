// JS File for Portal Email New View

$(function () {
	$('#txtBody').summernote();

	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtSubject: { required: true, maxlength: 50 },
			txtBody: { required: true, maxlength: 5000 },
			ddlEmailType: { required: true },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
