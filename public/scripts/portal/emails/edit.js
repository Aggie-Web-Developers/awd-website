// JS File for Portal Email Edit View

$(function () {
	const currentDate = new Date();

	populateSendDate();

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

function populateSendDate() {
	// check if a hidden variable is set with a send date, if so, convert to user's local time and populate form fields
	if ($('#hdnSendDateUTC').val() != '') {
		const sendDate = new Date($('#hdnSendDateUTC').val());

		$('#txtSendDate').val(formatDate(sendDate));
		$('#txtSendTime').val(
			sendDate.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			})
		);
	}
}

function formatDate(date) {
	// format date as YYYY-MM-DD (format needed to update value of a input[type="date"] field)
	const day = ('0' + date.getDate()).slice(-2);
	const month = ('0' + (date.getMonth() + 1)).slice(-2);

	return date.getFullYear() + '-' + month + '-' + day;
}
