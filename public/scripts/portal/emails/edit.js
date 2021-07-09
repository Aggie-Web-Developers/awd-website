// JS File for Portal Email Edit View

$(function () {
	const currentDate = new Date();

	tinymce.init({
		selector: '#txtBody',
		plugins: ['image link autoresize'],
		content_style: "body { font-family: 'Open Sans', sans-serif; }",
		toolbar:
			'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image |',
		autoresize_on_init: true,
	});

	$('#hdnTimezoneOffset').val(currentDate.getTimezoneOffset());

	$('#frm').validate({
		ignore: ':hidden, .note-editor *',
		rules: {
			txtSubject: { required: true, maxlength: 50 },
			ddlEmailType: { required: true },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
