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
// IIFE
(function() {
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

	// array of testimonial card Elements
	const testimonialCards = [
	];

	// populate testimonialCards
	testimonials.forEach(({quote, imgUrl, fullName, year, position}) => {
		const el = document.createElement('div');
		el.classList.add('testimonial-card');
		el.innerHTML = `
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
		testimonialCards.push(el);
	});

	// append first 3 elements of array to container of testimonial cards
	const testimonialsContainer = document.querySelector('.testimonial-cards');
	for (let i = 0; i < testimonialCards.length && i < 3; ++i) {
		testimonialsContainer.append(testimonialCards[i]);
	}

	// carousel control buttons
	const carouselControlLeft = document.querySelector('.carousel-control--left');
	const carouselControlRight = document.querySelector('.carousel-control--right');
	let leftClicked = false;
	let rightClicked = false;

	carouselControlLeft.addEventListener('click', async function() {
		if (leftClicked) { return; }
		leftClicked = true;

		// using viewportWidth and idx to account for media queries (because number of displayed cards will vary)
		const viewportWidth = window.innerWidth;
		let idx;
		if (viewportWidth > 1400) { idx = 2; }
		else if (viewportWidth > 1024) { idx = 1; }
		else { idx = 0; }
		idx = Math.min(idx, testimonialCards.length - 1);

		// leftmost cards move right
		for (let i = 0; i < idx; ++i) { testimonialCards[i].classList.add('moveRight'); }
		// rightmost card leaves to the right
		testimonialCards[idx].classList.add('leaveRight');
		
		// wait for moving/leaving animations to end
		await wait(200);

		// remove the last child from the container of cards
		testimonialsContainer.removeChild(testimonialsContainer.querySelector('.testimonial-card:last-child'));
		// insert the last element from the array of cards to the beginning of the container. This should be intuitive.
		testimonialsContainer.insertAdjacentElement('afterbegin', testimonialCards[testimonialCards.length - 1]);
		// remove animation classes from cards to prevent odd graphical glitch
		for (let i = 0; i < idx; ++i) { testimonialCards[i].className = 'testimonial-card'; }
		// animate new card entering from the left
		testimonialCards[testimonialCards.length - 1].classList.add('enterLeft');

		// wait for entering animation to finish
		await wait(100);

		// remove all animations
		for (let i = 0; i < idx; ++i) { testimonialCards[i].classList.remove('moveRight'); }
		testimonialCards[idx].classList.remove('leaveRight');
		testimonialCards[testimonialCards.length - 1].classList.remove('enterLeft');

		// shift the array of cards to the right (wrapping) to match new orientation
		testimonialCards.unshift(testimonialCards.pop());

		leftClicked = false;
	});

	carouselControlRight.addEventListener('click', async function() {
		if (rightClicked) { return; }
		rightClicked = true;

		const viewportWidth = window.innerWidth;
		let idx;
		if (viewportWidth > 1400) { idx = 2; }
		else if (viewportWidth > 1024) { idx = 1; }
		else { idx = 0; }
		idx = Math.min(idx, testimonialCards.length - 1);

		for (let i = idx; i > 0; --i) { testimonialCards[i].classList.add('moveLeft'); }
		testimonialCards[0].classList.add('leaveLeft');

		await wait(200);

		testimonialsContainer.removeChild(testimonialsContainer.querySelector('.testimonial-card:first-child'));
		testimonialsContainer.insertAdjacentElement('beforeend', testimonialCards[testimonialCards.length - 1]);
		for (let i = idx; i > 0; --i) { testimonialCards[i].className = 'testimonial-card'; }
		testimonialCards[(idx + 1) % testimonialCards.length].classList.add('enterRight');

		await wait(100);

		for (let i = idx; i > 0; --i) { testimonialCards[i].classList.remove('moveLeft'); }
		testimonialCards[0].classList.remove('leaveLeft');
		testimonialCards[(idx + 1) % testimonialCards.length].classList.remove('enterRight');

		testimonialCards.push(testimonialCards.shift());

		rightClicked = false;
	});
})();

