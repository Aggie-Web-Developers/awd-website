// JS File for 404 View

$(function () {
  document.title = 'AWD - 404';
	$('#divNav').addClass('notFound-banner');

	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());
	});

	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');
	});
});
