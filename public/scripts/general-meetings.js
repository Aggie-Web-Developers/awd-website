// JS File for General Meetings View

$(function () {
	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());
	});

	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');
	});
});
