// JS File for Our Sponsors View

$(function () {
	setHeadElements();
	$('#divNav').addClass('sponsors-banner');

	// navbar configuration
	$(document).scroll(function () {
		$('#navbar').toggleClass(
			'scrolled',
			$(this).scrollTop() > $('#navbar').height()
		);
	});

	$('.navbar-toggler').on('click', function () {
		$('#navbar').addClass('scrolled');
	});
});

function setHeadElements() {
	document.title = 'AWD - Our Sponsors';
	$('meta[name=description]').attr(
		'content',
		'Learn more about the sponsors of Aggie Web Developers.'
	);
}
