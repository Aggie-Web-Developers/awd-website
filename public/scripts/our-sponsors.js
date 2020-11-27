// JS File for Our Sponsors View

$(function () {
	setHeadElements();
	$('#divNav').addClass('sponsors-banner');
	$('#navbar').addClass('scrolled');

	$('.alert').click(function () {
		$(this).hide();
	});
});

function setHeadElements() {
	document.title = 'AWD - Our Sponsors';
	$('meta[name=description]').attr(
		'content',
		'Learn more about the sponsors of Aggie Web Developers.'
	);
}
