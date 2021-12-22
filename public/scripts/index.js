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

	// create testimonial cards
	testimonials.forEach(({quote, imgUrl, fullName, year, position}, idx) => {
		const newCard = document.createElement('div');
		newCard.classList.add('testimonial-card');
		newCard.innerHTML = `
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

		testimonialCards.push(newCard);
	});

	// append first 3 elements of array to container of testimonial cards
	const testimonialsContainer = document.querySelector('.testimonial-cards');
	for (let i = 0; i < testimonialCards.length && i < 3; ++i) {
		testimonialsContainer.append(testimonialCards[i]);
	}



	// CAROUSEL FIELDS
	const carouselControlLeft = document.querySelector('.carousel__control--left');
	const carouselControlRight = document.querySelector('.carousel__control--right');
	const numItems = testimonialCards.length;
	let currFrontIdx = 0; // index of the leftmost item in the carousel
	const breakpoint1 = 1400; // wider breakpoint
	const breakpoint2 = 1024; // thinner breakpoint
	let transitioning = false;
	const transitionTime1 = 200; // duration of first transition in milliseconds
	const transitionTime2 = 100;
	const transitionTimeFast = 25; // used for indicator presses

	// array of carousel indicators
	const carouselIndicators = [
	];

	// create indicators
	for (let i = 0; i < numItems; ++i) {
		const newIndicator = document.createElement('div');
		newIndicator.classList.add('carousel__indicator');
		newIndicator.dataset.index = `${i}`;

		carouselIndicators.push(newIndicator);
	}

	// append all carousel indicators to container of indicators
	const indicatorsContainer = document.querySelector('.carousel__indicators');
	for (let i = 0; i < carouselIndicators.length; ++i) {
		indicatorsContainer.append(carouselIndicators[i]);
	}

	// set first indicator to be active
	carouselIndicators[0].classList.add('active');

	function setIndicator(currIdx, targetIdx) {
		carouselIndicators[currIdx].classList.remove('active');
		carouselIndicators[targetIdx].classList.add('active');

		return targetIdx;
	}

	// get distance of rightmost item in carousel (number will vary because of media queries based on viewport width)
	function getRightmostDist() {
		let rightmostDist; // distance between leftmost item and rightmost item
		if (window.innerWidth > breakpoint1) { rightmostDist = 2; }
		else if (window.innerWidth > breakpoint2) { rightmostDist = 1; }
		else { rightmostDist = 0; }

		// accounts for carousel with less than 3 items
		rightmostDist = Math.min(rightmostDist, numItems - 1);

		return rightmostDist;
	}

	// move left in carousel
	async function shiftLeft(isFast) {
		if (transitioning) { return; }
		transitioning = true;

		const rightmostDist = getRightmostDist();

		// leftmost items move right
		for (let i = 0; i < rightmostDist; ++i) {
			isFast && testimonialCards[i].classList.add('transition-fast');
			testimonialCards[i].classList.add('moveRight');
		}
		// rightmost item leaves to the right
		isFast && testimonialCards[rightmostDist].classList.add('transition-fast');
		testimonialCards[rightmostDist].classList.add('leaveRight');

		// wait for moving/leaving animations to end
		await wait(isFast ? transitionTimeFast : transitionTime1);

		// remove the last child from the container of items
		testimonialsContainer.removeChild(testimonialsContainer.querySelector('.testimonial-card:last-child'));
		// insert the last element from the array of items to the beginning of the container. This should be intuitive.
		testimonialsContainer.insertAdjacentElement('afterbegin', testimonialCards[numItems - 1]);

		// remove animation classes from items to prevent odd graphical glitch
		for (let i = 0; i < rightmostDist; ++i) { testimonialCards[i].className = 'testimonial-card'; }
		// animate new item entering from the left
		isFast && testimonialCards[numItems - 1].classList.add('transition-fast');
		testimonialCards[numItems - 1].classList.add('enterLeft');

		// wait for entering animation to finish
		await wait(isFast ? transitionTimeFast : transitionTime2);

		// remove all animations
		for (let i = 0; i < rightmostDist; ++i) { testimonialCards[i].classList.remove('moveRight', 'transition-fast'); }
		testimonialCards[rightmostDist].classList.remove('leaveRight', 'transition-fast');
		testimonialCards[numItems - 1].classList.remove('enterLeft', 'transition-fast');

		// shift the array of items to the right (wrapping) to match new orientation
		testimonialCards.unshift(testimonialCards.pop());

		transitioning = false;
	}

	// move right in carousel
	async function moveRight(isFast) {
		// NOTE: upon first glance, it may seem that this could could easily be refactored from moveLeft. That is not the case
		if (transitioning) { return; }
		transitioning = true;

		const rightmostDist = getRightmostDist();

		for (let i = rightmostDist; i > 0; --i) {
			isFast && testimonialCards[i].classList.add('transition-fast');
			testimonialCards[i].classList.add('moveLeft');
		}
		isFast && testimonialCards[0].classList.add('transition-fast');
		testimonialCards[0].classList.add('leaveLeft');

		await wait(isFast ? transitionTimeFast : transitionTime1);

		testimonialsContainer.removeChild(testimonialsContainer.querySelector('.testimonial-card:first-child'));
		testimonialsContainer.insertAdjacentElement('beforeend', testimonialCards[numItems - 1]);

		for (let i = rightmostDist; i > 0; --i) { testimonialCards[i].className = 'testimonial-card'; }
		isFast && testimonialCards[(rightmostDist + 1) % numItems].classList.add('transition-fast');
		testimonialCards[(rightmostDist + 1) % numItems].classList.add('enterRight');

		await wait(isFast ? transitionTimeFast : transitionTime2);

		for (let i = rightmostDist; i > 0; --i) { testimonialCards[i].classList.remove('moveLeft', 'transition-fast'); }
		testimonialCards[0].classList.remove('leaveLeft', 'transition-fast');
		testimonialCards[(rightmostDist + 1) % numItems].classList.remove('enterRight', 'transition-fast');

		testimonialCards.push(testimonialCards.shift());

		transitioning = false;
	}

	// handle clicking left carousel control
	carouselControlLeft.addEventListener('click', function() {
		shiftLeft();
		currFrontIdx = setIndicator(currFrontIdx, currFrontIdx - 1 >= 0 ? currFrontIdx - 1 : numItems - 1);
	});

	// handle clicking right carousel control
	carouselControlRight.addEventListener('click', async function() {
		moveRight();
		currFrontIdx = setIndicator(currFrontIdx, (currFrontIdx + 1) % numItems);
	});

	// handle clicking an indicator
	indicatorsContainer.addEventListener('click', async function(e) {
		const clicked = e.target.closest('.carousel__indicator');

		if (!clicked || clicked.classList.contains('active')) { return; }

		const prevFrontIdx = currFrontIdx;
		const targetIdx = parseInt(clicked.dataset.index);
		currFrontIdx = setIndicator(currFrontIdx, targetIdx);

		// get distances for travelling left or right to reach target item
		const leftDist = targetIdx > prevFrontIdx
			? numItems - (targetIdx - prevFrontIdx)
			: Math.abs(targetIdx - prevFrontIdx);
		const rightDist = targetIdx > prevFrontIdx
			? targetIdx - prevFrontIdx
			: numItems - Math.abs(targetIdx - prevFrontIdx);

		// if left distance is shorter, use left shifts
		if (leftDist < rightDist) {
			for (let i = prevFrontIdx; i != targetIdx; i = (i - 1 >= 0 ? i - 1 : numItems - 1)) {
				await shiftLeft(true);
			}
		}
		// if right distance is shorter, use right shifts
		else if (leftDist > rightDist) {
			for (let i = prevFrontIdx; i != targetIdx; i = (i + 1) % numItems) {
				await moveRight(true);
			}
		}
		// if distances are equivalent, move in direction of target relative to current
		else {
			// if target is to the left, use left shifts
			if (targetIdx < prevFrontIdx) {
				for (let i = prevFrontIdx; i > targetIdx; --i) {
					await shiftLeft(true);
				}
			}
			// if target is to the right, use right shifts
			else {
				for (let i = prevFrontIdx; i < targetIdx; ++i) {
					await moveRight(true);
				}
			}
		}
	});
})();

