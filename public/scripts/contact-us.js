// JS File for Conact Us View

$(function () {
	setHeadElements();
	$('#divNav').addClass('contact-us-banner');
	setInitialNavbarColors();

	// navbar configuration
	$(document).scroll(function () {
		$('#navbar').toggleClass(
			'scrolled',
			$(this).scrollTop() > $('#navbar').height()
		);

		if ($(this).scrollTop() <= $('#navbar').height()) {
			$(
				'.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, ' +
					'.navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link'
			).css('color', '#341f97');

			$('#mainLogo').css('color', '#341f97');
			$('.navbar-toggler').addClass('custom-toggler');
			$('.navbar-toggler-icon').addClass('custom-toggler');
		} else {
			$(
				'.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, ' +
					'.navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link'
			).css('color', '#fff');

			$('#mainLogo').css('color', '#fff');
			$('.navbar-toggler').removeClass('custom-toggler');
			$('.navbar-toggler-icon').removeClass('custom-toggler');
		}
	});

	// handle span toggler styling for lower breakpoints
	$('.navbar-toggler').on('click', function () {
		$('#navbar').addClass('scrolled');

		$(
			'.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, ' +
				'.navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link'
		).css('color', '#fff');

		$('#mainLogo').css('color', '#fff');
		$('.navbar-toggler').removeClass('custom-toggler');
		$('.navbar-toggler-icon').removeClass('custom-toggler');
	});

	// add event listeners for contact buttons
	$('#btnContactGeneral').on('click', function () {
		$('#divCorpContact').slideUp(600);
		$('#divGenContact').slideDown(600);

		scrollTo();
	});

	$('#btnContactCorporate').on('click', function () {
		$('#divGenContact').slideUp(600);
		$('#divCorpContact').slideDown(600);

		scrollTo();
	});

	// validation and ajax for general contact us form
	$('#frmGen')
		.submit(function (e) {
			e.preventDefault();
		})
		.validate({
			ignore: ':hidden',
			rules: {
				txtNameGen: { required: true },
				txtEmailGen: { required: true, email: true },
				ddlSubjectGen: { required: true },
				txtCommentsGen: { required: true },
				chkTermsGen: { required: true },
			},
			messages: {
				txtNameGen: { required: 'Please enter your name.' },
				txtEmailGen: { required: 'Please enter an email address.' },
				ddlSubjectGen: {
					required: 'Please select a reason for contacting us.',
				},
				txtCommentsGen: {
					required: 'Please enter your comments or questions.',
				},
				chkTermsGen: {
					required: 'You must agree to our terms and conditions.',
				},
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.closest('.form-group'));
			},
			submitHandler: function () {
				var form = $('#frmGen');
				var url = form.attr('action');

				$.ajax({
					type: 'POST',
					url: url,
					data: form.serialize(),
					success: function (data) {
						$('html, body').animate({ scrollTop: 0 }, 'slow');
						$('#divGenContact').slideUp(1500);
						$('#frmGen')[0].reset();

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

	// validation and ajax for corporate contact us form
	$('#frmCorp')
		.submit(function (e) {
			e.preventDefault();
		})
		.validate({
			ignore: ':hidden',
			rules: {
				txtNameCorp: { required: true },
				txtCorp: { required: true },
				txtEmailCorp: { required: true, email: true },
				ddlSubjectCorp: { required: true },
				txtCommentsCorp: { required: true },
				chkTermsCorp: { required: true },
			},
			messages: {
				txtNameCorp: { required: 'Please enter your name.' },
				txtCorp: { required: 'Please enter the name of your company.' },
				txtEmailCorp: { required: 'Please enter an email address.' },
				ddlSubjectCorp: {
					required: 'Please select a reason for contacting us.',
				},
				txtCommentsCorp: {
					required: 'Please enter your comments or questions.',
				},
				chkTermsCorp: {
					required: 'You must agree to our terms and conditions.',
				},
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.closest('.form-group'));
			},
			submitHandler: function () {
				var form = $('#frmCorp');
				var url = form.attr('action');

				$.ajax({
					type: 'POST',
					url: url,
					data: form.serialize(),
					success: function (data) {
						$('html, body').animate({ scrollTop: 0 }, 'slow');
						$('#divCorpContact').slideUp(1500);
						$('#frmCorp')[0].reset();

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

function setInitialNavbarColors() {
	$(
		'.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, ' +
			'.navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link'
	).css('color', '#341f97');

	$('#mainLogo').css('color', '#341f97');

	$('.navbar-toggler').addClass('custom-toggler');
	$('.navbar-toggler-icon').addClass('custom-toggler');
}

function scrollTo() {
	$('html, body').animate(
		{
			scrollTop: $('#divPlaceholder').offset().top + 750,
		},
		600
	);
}

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

function setHeadElements() {
	document.title = 'AWD - Contact Us';
	$('meta[name=description]').attr(
		'content',
		'Get in touch with Aggie Web Developers.'
	);
}
