// JS File for Index View

$(function () {
	$('#divNav').addClass('home-banner-img');
	$('#divNav').removeClass('page-banner');
	$('#divNav').removeClass('page-banner');
	$('#frm').removeClass('d-none');
	$('#navbar').addClass('scrolled');

	$('.alert').click(function () {
		$(this).hide();
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

	// validation and ajax email signup form
	$('#frm')
		.submit(function (e) {
			e.preventDefault();
		})
		.validate({
			rules: {
				txtEmail: { required: true, email: true, maxlength: 300 },
			},
			messages: {
				txtEmail: {
					required: 'Please enter an email address.',
				},
			},
			errorPlacement: function (error, element) {
				error.prependTo(element.closest('.col-lg-10'));
			},
			submitHandler: function () {
				var form = $('#frm');
				var url = form.attr('action');

				$.ajax({
					type: 'POST',
					url: url,
					data: form.serialize(),
					success: function (data) {
						$('#frm')[0].reset();
						$('html, body').animate({ scrollTop: 0 }, 'slow');
						checkAlerts(data);
					},
					error: function () {
						checkAlerts(
							"Whoops! We encountered an error, and weren't able to send your message."
						);
					},
				});

				return false;
			},
		});
});

function checkAlerts(alert) {
	var alertDiv = '';

	if (alert && alert != '') {
		if (alert.includes('success') || alert.includes('Success')) {
			alertDiv =
				"<div class='alert alert-success' role='alert'>" + alert + '</div>';
		} else {
			alertDiv =
				"<div class='alert alert-danger' role='alert'>" + alert + '</div>';
		}

		$('#navbar').hide().append(alertDiv).fadeIn(3000);

		$('.alert').click(function () {
			$(this).hide();
		});
	}
}

const wait = milliseconds => 
    new Promise(resolve => 
        setTimeout(resolve, milliseconds)
    );
;

/* ************************************** */
/* *************TESTIMONIALS************* */
/* ************************************** */
// Example set of testimonial data
const testimonials = [
	{
		quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
	is due any day now! Definitely telling everyone I know about this shop.`,
		imgUrl: `images/Trey-Bio-Pic-min.jpg`,
		fullName: `Captain America`,
		year: 22,
		position: `Member`
	},
	{
		quote: `I don't feel like grabbing filler text here.`,
		imgUrl: `images/Vignesh-Bio-Pic-min.jpg`,
		fullName: `Hawkeye`,
		year: 22,
		position: `Operations Officer`
	},
	{
		quote: `
	Tincidunt lobortis feugiat vivamus at augue eget arcu. Consectetur libero id faucibus nisl
	tincidunt eget. Dignissim sodales ut eu sem integer vitae justo.
`,
		imgUrl: `images/Cole-Bio-Pic-min.jpg`,
		fullName: `Tony Stark`,
		year: 22,
		position: `Former Officer`
	},
	{
		quote: `
		Ipsum dolor sit amet consectetur adipiscing. Est pellentesque elit ullamcorper dignissim cras
		tincidunt lobortis feugiat vivamus. Sit amet nulla facilisi morbi tempus iaculis urna id
		volutpat.
	`,
		imgUrl: `images/Alan-Bio-Pic-min.jpg`,
		fullName: `Peter Parker`,
		year: 22,
		position: `Project Manager`
	},
];

let startIdx = 0; // index into the above array of testimonial data

function setTestimonialCard({quote, imgUrl, fullName, year, position}, cardNum) {
	const testimonialCard = document.querySelector(`.testimonial-card:nth-child(${cardNum})`);
	testimonialCard.innerHTML = `
	<div class="testimonial-card__body">
		<div class="testimonial-card__quotation-mark-container">
			<img class="testimonial-card__quotation-mark" src="images/SVGs/opening-quotation-mark.svg"
				alt="opening quotation mark" />
		</div>
		<p class="testimonial-card__quote paragraph">
			${quote}
		</p>
	</div>
	<div class="testimonial-card__footer">
		<div class="photo-small">
			<img class="photo-small__img" src="${imgUrl}" alt="${fullName}">
		</div>
		<div class="testimonial-card__member-details">
			<p class="testimonial-card__member-name">${fullName} &lsquo;${year}</p>
			<p class="testimonial-card__member-position">${position}</p>
		</div>
	</div>
	`;
};

// set all 3 testimonial cards
function setTestimonialCardAll(testimonials, startIdx) {
	setTestimonialCard(testimonials[startIdx], 1);
	setTestimonialCard(testimonials[(startIdx+1) % testimonials.length], 2);
	setTestimonialCard(testimonials[(startIdx+2) % testimonials.length], 3);
}

// initialize the testimonial cards
setTestimonialCardAll(testimonials, 0);

// carousel control buttons
const carouselControlLeft = document.querySelector('.carousel-control--left');
const carouselControlRight = document.querySelector('.carousel-control--right');
let leftClicked = false;
let rightClicked = false;

carouselControlLeft.addEventListener('click', function() {
	if (leftClicked) { return; }
	leftClicked = true;
	startIdx = startIdx > 0 ? startIdx - 1 : testimonials.length - 1;
	const testimonialCard1 = document.querySelector(`.testimonial-card:nth-child(1)`);
	const testimonialCard2 = document.querySelector(`.testimonial-card:nth-child(2)`);
	const testimonialCard3 = document.querySelector(`.testimonial-card:nth-child(3)`);
	const viewportWidth = window.innerWidth;
	if (viewportWidth > 1024) {
		testimonialCard1.classList.add('moveRight');
		testimonialCard2.classList.add('moveRight');
		testimonialCard3.classList.add('leaveRight');

		wait(300)
			.then(() => {
				testimonialCard1.classList.add('enterLeft');
				setTestimonialCardAll(testimonials, startIdx);
				return wait(100);
			})
			.then(() => {
				testimonialCard1.classList.remove('moveRight');
				testimonialCard2.classList.remove('moveRight');
				testimonialCard3.classList.remove('leaveRight');
				testimonialCard1.classList.remove('enterLeft');
				leftClicked = false;
			});
	}
	else if (viewportWidth > 768) {
		testimonialCard1.classList.add('moveRight');
		testimonialCard2.classList.add('leaveRight');

		wait(300)
			.then(() => {
				setTestimonialCardAll(testimonials, startIdx);
				testimonialCard1.classList.add('enterLeft');
				return wait(300);
			})
			.then(() => {
				testimonialCard1.classList.remove('moveRight');
				testimonialCard2.classList.remove('leaveRight');
				testimonialCard1.classList.remove('enterLeft');
				leftClicked = false;
			});
	}
	else  {
		testimonialCard1.classList.add('leaveRight');

		wait(300)
			.then(() => {
				setTestimonialCardAll(testimonials, startIdx);
				testimonialCard1.classList.add('enterLeft');
				return wait(300);
			})
			.then(() => {
				testimonialCard1.classList.remove('leaveRight');
				testimonialCard1.classList.remove('enterLeft');
				leftClicked = false;
			});
	}
});

carouselControlRight.addEventListener('click', function() {
	if (rightClicked) { return; }
	rightClicked = true;
	startIdx = (startIdx + 1) % testimonials.length;

	const testimonialCard1 = document.querySelector(`.testimonial-card:nth-child(1)`);
	const testimonialCard2 = document.querySelector(`.testimonial-card:nth-child(2)`);
	const testimonialCard3 = document.querySelector(`.testimonial-card:nth-child(3)`);
	const viewportWidth = window.innerWidth;

	if (viewportWidth > 1024) {
		testimonialCard3.classList.add('moveLeft');
		testimonialCard2.classList.add('moveLeft');
		testimonialCard1.classList.add('leaveLeft');

		wait(300)
			.then(() => {
				testimonialCard3.classList.add('enterRight');
				setTestimonialCardAll(testimonials, startIdx);
				return wait(300);
			})
			.then(() => {
				testimonialCard3.classList.remove('moveLeft');
				testimonialCard2.classList.remove('moveLeft');
				testimonialCard1.classList.remove('leaveLeft');
				testimonialCard3.classList.remove('enterRight');
				rightClicked = false;
			});
	}
	else if (viewportWidth > 768) {
		testimonialCard2.classList.add('moveLeft');
		testimonialCard1.classList.add('leaveLeft');

		wait(300)
			.then(() => {
				setTestimonialCardAll(testimonials, startIdx);
				testimonialCard2.classList.add('enterRight');
				return wait(300);
			})
			.then(() => {
				testimonialCard2.classList.remove('moveLeft');
				testimonialCard1.classList.remove('leaveLeft');
				testimonialCard2.classList.remove('enterRight');
				rightClicked = false;
			});
	}
	else  {
		testimonialCard1.classList.add('leaveLeft');

		wait(300)
			.then(() => {
				setTestimonialCardAll(testimonials, startIdx);
				testimonialCard1.classList.add('enterRight');
				return wait(300);
			})
			.then(() => {
				testimonialCard1.classList.remove('leaveLeft');
				testimonialCard1.classList.remove('enterRight');
				rightClicked = false;
			});
	}
});
