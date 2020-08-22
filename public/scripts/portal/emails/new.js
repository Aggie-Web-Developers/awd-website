// JS File for Portal Email New View

$(function () {
	setupSummerNote();

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

function setupSummerNote() {
	$('#txtBody').summernote({
		fontNames: ['Open Sans'],
		fontName: 'Open Sans',
	});

	$('.note-editor .note-editable').css({
		'line-height': '0.8',
		'font-family': '"Open Sans", sans-serif',
	});
}
