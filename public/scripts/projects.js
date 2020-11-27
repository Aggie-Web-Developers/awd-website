// JS File for Projects View

$(function () {
	setHeadElements();
	$('#divNav').addClass('projects-banner');
	$('#navbar').addClass('scrolled');

	$('.alert').click(function () {
		$(this).hide();
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
