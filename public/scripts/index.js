// JS File for Index View

$(function () {
	$('#divNav').addClass('home-banner-img');
	$('#divNav').removeClass('page-banner');
	$('#divNav').removeClass('page-banner');
	$('#frm').removeClass('d-none');

	// navbar configuration
	$(document).scroll(function () {
		$("#navbar").toggleClass('scrolled', $(this).scrollTop() > $("#navbar").height());
	});

	$('.navbar-toggler').on('click', function() {
		$("#navbar").addClass('scrolled');
	});

	// animate news card section
	$('.post-module').hover(function() {
	    $(this).find('.description').stop().animate({
	        height: "toggle",
	        opacity: "toggle"
	    }, 300);
	});

	// validate email form
	$("#frm").validate({
        rules: {
            txtEmail: { required: true, email: true }
        },
        messages: {
            txtEmail: { 
            	required: 'Please enter an email address.'
            }
        },
        errorPlacement: function(error, element) {
            error.prependTo(element.closest('.col-lg-10'));
        }
    });
});
