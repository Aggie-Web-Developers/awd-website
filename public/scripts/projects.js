// JS File for Projects View

$(function () {
	setHeadElements();
	$('#divNav').addClass('projects-banner');

	$('.alert').click(function () {
		$(this).hide();
	});

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
	$(window).on('load', function () {
		$('.project-module').hover(function () {
			$(this).find('.description').stop().animate(
				{
					height: 'toggle',
					opacity: 'toggle',
				},
				300
			);
		});
	});
});

function setHeadElements() {
	document.title = 'AWD - Projects';
	$('meta[name=description]').attr(
		'content',
		'View the projects completed and in progress by Aggie Web Developers.'
	);
}
