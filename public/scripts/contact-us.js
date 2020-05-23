// JS File for Conact Us View

$(function () {
	document.title = 'AWD - Contact Us';
	$('#divNav').addClass('contact-us-banner');
	setInitialNavbarColors();

	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());

		if ($(this).scrollTop() <= $("#navbar").height())
		{
			$(".navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, " + 
				".navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link").css('color', '#341f97');

			$('#mainLogo').css('color', '#341f97');
			$('.navbar-toggler').addClass('custom-toggler');
			$('.navbar-toggler-icon').addClass('custom-toggler');
		} else {
			$(".navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, " + 
				".navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link").css('color', '#fff');
			
			$('#mainLogo').css('color', '#fff');
			$('.navbar-toggler').removeClass('custom-toggler');
			$('.navbar-toggler-icon').removeClass('custom-toggler');
		}
	});

	// handle span toggler styling for lower breakpoints
	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');

		$(".navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, " + 
			".navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link").css('color', '#fff');

		$('#mainLogo').css('color', '#fff');
		$('.navbar-toggler').removeClass('custom-toggler');
		$('.navbar-toggler-icon').removeClass('custom-toggler');
	});

	// add event listeners for contact buttons
	$('#btnContactGeneral').on('click', function() {
		$('#divCorpContact').slideUp(600);
		$('#divGenContact').slideDown(600);

		scrollTo();
	});

	$('#btnContactCorporate').on('click', function() {
		$('#divGenContact').slideUp(600);
		$('#divCorpContact').slideDown(600);

		scrollTo();
	});
});

function setInitialNavbarColors() {
	$(".navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, " + 
		".navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link").css('color', '#341f97');

	$('#mainLogo').css('color', '#341f97');
}

function scrollTo() {
	$('html, body').animate({
        scrollTop: $('#divPlaceholder').offset().top + 750
    }, 600);
}

