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

// IIFE
(function() {
	class Carousel {
		_maxItemsDisplayed = 3; // hard coded for now
		_currFrontIdx = 0;
		_indicatorsArray = [];
		_transitionTime1 = 200; // hard coded for now
		_transitionTime2 = 100; // hard coded for now
		_transitionTimeFast = 25; // hard coded for now
		_transitioning = false;

		constructor({carouselID, itemsContainerClass, itemElemClass, itemElemsArray, numItems, breakpoint1, breakpoint2}) {
			this._carouselElem = document.getElementById(`${carouselID}`);
			this._itemElemClass = itemElemClass;
			this._itemElemsArray = itemElemsArray;
			this._numItems = numItems;
			this._itemsContainerElem = this._carouselElem.querySelector(`.${itemsContainerClass}`);
			this._breakpoint1 = breakpoint1;
			this._breakpoint2 = breakpoint2;
			

			this._indicatorsContainerElem = this._carouselElem.querySelector('.carousel__indicators');
			this._controlLeft = this._carouselElem.querySelector('.carousel__control--left');
			this._controlRight = this._carouselElem.querySelector('.carousel__control--right');
		}

		initialize() {
			this._fillItemsContainer();
			this._createIndicators();
			this._attachCarouselBtnListeners();
		}

		_fillItemsContainer() {
			for (let i = 0; i < this._numItems && i < this._maxItemsDisplayed; ++i) {
				this._itemsContainerElem.append(this._itemElemsArray[i]);
			}
		}

		_createIndicators() {
			for (let i = 0; i < this._numItems; ++i) {
				// create indicator element
				const newIndicator = document.createElement('div');
				newIndicator.classList.add('carousel__indicator');
				newIndicator.dataset.index = `${i}`;

				// push to array of indicator elements
				this._indicatorsArray.push(newIndicator);
				// append to container of indicator elements
				this._indicatorsContainerElem.append(newIndicator);
			}
			
			// set first indicator to be active
			this._indicatorsArray[0].classList.add('active');
		}

		_setIndicator(currIdx, targetIdx) {
			this._indicatorsArray[currIdx].classList.remove('active');
			this._indicatorsArray[targetIdx].classList.add('active');

			return targetIdx;
		}

		// gets distance of rightmost item in carousel (number will vary because of media queries based on viewport width)
		_getRightmostDist() {
			let rightmostDist; // distance between leftmost item and rightmost item
			if (window.innerWidth > this._breakpoint1) { rightmostDist = 2; }
			else if (window.innerWidth > this._breakpoint2) { rightmostDist = 1; }
			else { rightmostDist = 0; }

			// accounts for carousel with less than 3 items
			rightmostDist = Math.min(rightmostDist, this._numItems - 1);

			return rightmostDist;
		}

		// move left in carousel
		async _shiftLeft(isFast) {
			if (this._transitioning) { return; }
			this._transitioning = true;
	
			const rightmostDist = this._getRightmostDist();
	
			// leftmost items move right
			for (let i = 0; i < rightmostDist; ++i) {
				isFast && this._itemElemsArray[i].classList.add('transition-fast');
				this._itemElemsArray[i].classList.add('moveRight');
			}
			// rightmost item leaves to the right
			isFast && this._itemElemsArray[rightmostDist].classList.add('transition-fast');
			this._itemElemsArray[rightmostDist].classList.add('leaveRight');
	
			// wait for moving/leaving animations to end
			await wait(isFast ? this._transitionTimeFast : this._transitionTime1);
	
			// remove the last child from the container of items
			this._itemsContainerElem.removeChild(this._itemsContainerElem.querySelector(`.${this._itemElemClass}:last-child`));
			// insert the last element from the array of items to the beginning of the container. This should be intuitive.
			this._itemsContainerElem.insertAdjacentElement('afterbegin', this._itemElemsArray[this._numItems - 1]);
	
			// remove animation classes from items to prevent odd graphical glitch
			for (let i = 0; i < rightmostDist; ++i) { this._itemElemsArray[i].className = this._itemElemClass; }
			// animate new item entering from the left
			isFast && this._itemElemsArray[this._numItems - 1].classList.add('transition-fast');
			this._itemElemsArray[this._numItems - 1].classList.add('enterLeft');
	
			// wait for entering animation to finish
			await wait(isFast ? this._transitionTimeFast : this._transitionTime2);
	
			// remove all animations
			for (let i = 0; i < rightmostDist; ++i) { this._itemElemsArray[i].classList.remove('moveRight', 'transition-fast'); }
			this._itemElemsArray[rightmostDist].classList.remove('leaveRight', 'transition-fast');
			this._itemElemsArray[this._numItems - 1].classList.remove('enterLeft', 'transition-fast');
	
			// shift the array of items to the right (wrapping) to match new orientation
			this._itemElemsArray.unshift(this._itemElemsArray.pop());
	
			this._transitioning = false;
		}

		// move right in carousel
		async _shiftRight(isFast) {
			// NOTE: upon first glance, it may seem that this could could easily be refactored from moveLeft. That is not the case
			if (this._transitioning) { return; }
			this._transitioning = true;

			const rightmostDist = this._getRightmostDist();

			for (let i = rightmostDist; i > 0; --i) {
				isFast && this._itemElemsArray[i].classList.add('transition-fast');
				this._itemElemsArray[i].classList.add('moveLeft');
			}
			isFast && this._itemElemsArray[0].classList.add('transition-fast');
			this._itemElemsArray[0].classList.add('leaveLeft');

			await wait(isFast ? this._transitionTimeFast : this._transitionTime1);

			this._itemsContainerElem.removeChild(this._itemsContainerElem.querySelector(`.${this._itemElemClass}:first-child`));
			this._itemsContainerElem.insertAdjacentElement('beforeend',
				this._itemElemsArray[Math.min(this._maxItemsDisplayed, this._numItems - 1)]);

			for (let i = rightmostDist; i > 0; --i) { this._itemElemsArray[i].className = this._itemElemClass; }
			isFast && this._itemElemsArray[(rightmostDist + 1) % this._numItems].classList.add('transition-fast');
			this._itemElemsArray[(rightmostDist + 1) % this._numItems].classList.add('enterRight');

			await wait(isFast ? this._transitionTimeFast : this._transitionTime2);

			for (let i = rightmostDist; i > 0; --i) { this._itemElemsArray[i].classList.remove('moveLeft', 'transition-fast'); }
			this._itemElemsArray[0].classList.remove('leaveLeft', 'transition-fast');
			this._itemElemsArray[(rightmostDist + 1) % this._numItems].classList.remove('enterRight', 'transition-fast');

			this._itemElemsArray.push(this._itemElemsArray.shift());

			this._transitioning = false;
		}

		_attachCarouselBtnListeners() {
			// handle clicking left carousel control
			const leftCallback = async function() {
				await this._shiftLeft();
				this._currFrontIdx = this._setIndicator(this._currFrontIdx, this._currFrontIdx - 1 >= 0
					? this._currFrontIdx - 1
					: this._numItems - 1);
			};
			this._controlLeft.addEventListener('click', leftCallback.bind(this));

			// handle clicking right carousel control
			const rightCallback = async function() {
				await this._shiftRight();
				this._currFrontIdx = this._setIndicator(this._currFrontIdx, (this._currFrontIdx + 1) % this._numItems);
			};
			this._controlRight.addEventListener('click', rightCallback.bind(this));

			// handle clicking an indicator
			const indicatorCallback = async function(e) {
				const clicked = e.target.closest('.carousel__indicator');

				if (!clicked || clicked.classList.contains('active')) { return; }

				const prevFrontIdx = this._currFrontIdx;
				const targetIdx = parseInt(clicked.dataset.index);
				this._currFrontIdx = this._setIndicator(this._currFrontIdx, targetIdx);

				// get distances for travelling left or right to reach target item
				const leftDist = targetIdx > prevFrontIdx
					? this._numItems - (targetIdx - prevFrontIdx)
					: Math.abs(targetIdx - prevFrontIdx);
				const rightDist = targetIdx > prevFrontIdx
					? targetIdx - prevFrontIdx
					: this._numItems - Math.abs(targetIdx - prevFrontIdx);

				// if left distance is shorter, use left shifts
				if (leftDist < rightDist) {
					for (let i = prevFrontIdx; i != targetIdx; i = (i - 1 >= 0 ? i - 1 : this._numItems - 1)) {
						await this._shiftLeft(true);
					}
				}
				// if right distance is shorter, use right shifts
				else if (leftDist > rightDist) {
					for (let i = prevFrontIdx; i != targetIdx; i = (i + 1) % this._numItems) {
						await this._shiftRight(true);
					}
				}
				// if distances are equivalent, move in direction of target relative to current
				else {
					// if target is to the left, use left shifts
					if (targetIdx < prevFrontIdx) {
						for (let i = prevFrontIdx; i > targetIdx; --i) {
							await this._shiftLeft(true);
						}
					}
					// if target is to the right, use right shifts
					else {
						for (let i = prevFrontIdx; i < targetIdx; ++i) {
							await this._shiftRight(true);
						}
					}
				}
			};
			this._indicatorsContainerElem.addEventListener('click', indicatorCallback.bind(this));
		}
	};
	
	/* ************************************** */
	/* *************TESTIMONIALS************* */
	/* ************************************** */
	// Examples of testimonial data
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
			quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
		is due any day now! Definitely telling everyone I know about this shop.`,
			imgUrl: `images/Trey-Bio-Pic-min.jpg`,
			fullName: `Captain America`,
			year: 22,
			position: `A`
		},
		{
			quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
		is due any day now! Definitely telling everyone I know about this shop.`,
			imgUrl: `images/Trey-Bio-Pic-min.jpg`,
			fullName: `Captain America`,
			year: 22,
			position: `B`
		},
		{
			quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
		is due any day now! Definitely telling everyone I know about this shop.`,
			imgUrl: `images/Trey-Bio-Pic-min.jpg`,
			fullName: `Captain America`,
			year: 22,
			position: `C`
		},
		{
			quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
		is due any day now! Definitely telling everyone I know about this shop.`,
			imgUrl: `images/Trey-Bio-Pic-min.jpg`,
			fullName: `Captain America`,
			year: 22,
			position: `D`
		},
		{
			quote: `So many fun uses! I'm planning on using this playsilk for newborn photos for my baby girl, who\
		is due any day now! Definitely telling everyone I know about this shop.`,
			imgUrl: `images/Trey-Bio-Pic-min.jpg`,
			fullName: `Captain America`,
			year: 22,
			position: `E`
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
	const testimonialsContainer = document.querySelector('#member-testimonials-carousel .testimonial-cards');
	for (let i = 0; i < testimonialCards.length && i < 3; ++i) {
		testimonialsContainer.append(testimonialCards[i]);
	}

	// Create carousel for member testimonial cards cards
	const memberTestimonialsCarouselOptions = {
		carouselID: 'member-testimonials-carousel',
		itemsContainerClass: 'testimonial-cards',
		itemElemClass: 'testimonial-card',
		itemElemsArray: testimonialCards,
		numItems: testimonialCards.length,
		breakpoint1: 1400,
		breakpoint2: 1024,
	};
	const memberTestimonialsCarousel = new Carousel(memberTestimonialsCarouselOptions);
	memberTestimonialsCarousel.initialize();


	
	/* ************************************** */
	/* *************NEWS AND EVENTS************* */
	/* ************************************** */
	const newsAndEventsCardsContainer = document.querySelector('#news-and-events-carousel .info-cards');
	const newsAndEventsCards = [...newsAndEventsCardsContainer.querySelectorAll('.info-card')];
	// empty the container so that we can refill it with just 3 of the items
	newsAndEventsCardsContainer.innerHTML = '';

	// refill the container using the first 3 cards
	for (let i = 0; i < newsAndEventsCards.length && i < 3; ++i) {
		newsAndEventsCardsContainer.append(newsAndEventsCards[i]);
	}

	// Create carousel for news and events cards
	const newsAndEventsCarouselOptions = {
		carouselID: 'news-and-events-carousel',
		itemsContainerClass: 'info-cards',
		itemElemClass: 'info-card',
		itemElemsArray: newsAndEventsCards,
		numItems: newsAndEventsCards.length,
		breakpoint1: 1390,
		breakpoint2: 976,
	};
	const newsAndEventsCarousel = new Carousel(newsAndEventsCarouselOptions);
	newsAndEventsCarousel.initialize();
})();

