// JS File for General Meetings View

$(function () {
	setHeadElements();
	$('#divNav').addClass('meetings-banner');

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
});

function setHeadElements() {
	document.title = 'AWD - General Meetings';
	$('meta[name=description]').attr(
		'content',
		'Learn more about weekly general meetings at AWD.'
	);
}
