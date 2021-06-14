// JS File for Portal Project Edit View

jQuery.validator.addMethod(
	'greaterThan',
	function (value, element, params) {
		if (!value) return true;

		if (!/Invalid|NaN/.test(new Date(value))) {
			return new Date(value) > new Date($(params).val());
		}

		return (
			(isNaN(value) && isNaN($(params).val())) ||
			Number(value) > Number($(params).val())
		);
	},
	'End date must be after the start date.'
);

$(function () {
	$('#frm').validate({
		ignore: ':hidden',
		rules: {
			txtName: { required: true, maxlength: 50 },
			txtWork: { required: true, maxlength: 50 },
			txtStatus: { required: true, maxlength: 25 },
			txtManager: { required: true, maxlength: 50 },
			txtTestLink: { required: true, maxlength: 150 },
			txtGithub: { required: true, maxlength: 150 },
			txtImageLink: { required: true, maxlength: 500 },
			txtStartDate: { required: true },
			txtEndDate: { required: false, greaterThan: '#txtStartDate' },
		},
		errorPlacement: function (error, element) {
			error.appendTo(element.closest('.form-group'));
		},
	});
});
