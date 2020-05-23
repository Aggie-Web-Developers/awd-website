// JS File for Our Sponsors View

$(function () {
	document.title = 'AWD - Our Sponsors';
	$('#divNav').addClass('sponsors-banner');

	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());
	});

	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');
	});
});
