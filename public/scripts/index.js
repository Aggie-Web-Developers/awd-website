// JS File for Index View


$(function () {
	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());
	});

	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');
	});

	// animate news card section
	$(window).on('load', function() {
		$('.post-module').hover(function() {
		    $(this).find('.description').stop().animate({
		        height: "toggle",
		        opacity: "toggle"
		    }, 300);
		});
	});
});
