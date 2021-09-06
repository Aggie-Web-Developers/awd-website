// JS File for Index View

$(function () {
	$('#divNav').addClass('home-banner-img');
	$('#divNav').removeClass('page-banner');
	$('#divNav').removeClass('page-banner');
	$('#frm').removeClass('d-none');
	$('#navbar').addClass('scrolled');

	$('.alert').click(function () {
		$(this).hide();
	});

	// animate news card section
	$('.post-module').hover(function () {
		$(this).find('.description').stop().animate(
			{
				height: 'toggle',
				opacity: 'toggle',
			},
			300
		);
	});

	// validation and ajax email signup form
	$('#frm')
		.submit(function (e) {
			e.preventDefault();
		})
		.validate({
			ignore: ':hidden:not(#hiddenEmailRecaptcha)',
			rules: {
				txtEmail: { required: true, email: true, maxlength: 100 },
				hiddenEmailRecaptcha: { required: true },
			},
			messages: {
				txtEmail: {
					required: 'Please enter an email address.',
				},
				hiddenEmailRecaptcha: { required: 'Please complete the captcha.' },
			},
			errorPlacement: function (error, element) {
				error.prependTo(element.closest('.col-lg-10'));
			},
			submitHandler: function () {
				var form = $('#frm');
				var url = form.attr('action');

				$.ajax({
					type: 'POST',
					url: url,
					data: form.serialize(),
					success: function (data) {
						$('#frm')[0].reset();
						$('html, body').animate({ scrollTop: 0 }, 'slow');
						checkAlerts(data);
					},
					error: function () {
						checkAlerts(
							"Whoops! We encountered an error, and weren't able to send your message."
						);
					},
				});

				return false;
			},
		});
});

function checkAlerts(alert) {
	var alertDiv = '';

	if (alert && alert != '') {
		if (alert.includes('success') || alert.includes('Success')) {
			alertDiv =
				"<div class='alert alert-success' role='alert'>" + alert + '</div>';
		} else {
			alertDiv =
				"<div class='alert alert-danger' role='alert'>" + alert + '</div>';
		}

		$('#navbar').hide().append(alertDiv).fadeIn(1000);

		$('.alert').click(function () {
			$(this).hide();
		});
	}
}

function setEmailCaptcha(response) {
	$('#hiddenEmailRecaptcha').val(response);
}

function CaptchaCallback() {
	var widgetId1;
	widgetId1 = grecaptcha.render('emailCaptcha', {
		sitekey: '6LdEY94ZAAAAABoFUprOOSUaWB6Zo32-WnxFaVek',
		callback: setEmailCaptcha,
	});
}
