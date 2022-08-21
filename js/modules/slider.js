// ************************************************************************** //
//                                  Slider                                    //
// ************************************************************************** //

function slider() {
	let offset = 0;
	let slideIndex = 1;

	const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

	/* Проинициализировать начальные цифры над картинкой */
	current.innerText = (slides.length < 10) ? `0${slideIndex}` : slideIndex;
	total.innerText = (slides.length < 10) ? `0${slides.length}` : slides.length;

	/* Картинки будут располагаться в ряд flex, overflow: hidden, и смещаться относительно поля */
	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	/* Создать список индикаторов */
	const indicators = document.createElement('ol'),
		dots = [];
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 15;
			display: flex;
			justify-content: center;
			margin-right: 15%;
			margin-left: 15%;
			list-style: none;`;
	slider.append(indicators);

	/* Отрендерить каждый интикатор */
	for (let i = 0; i < slides.length; ++i) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
				box-sizing: content-box;
				flex: 0 1 auto;
				width: 30px;
				height: 6px;
				margin-right: 3px;
				margin-left: 3px;
				cursor: pointer;
				background-color: #fff;
				background-clip: padding-box;
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				opacity: .5;
				transition: opacity .6s ease;
			`;
		if (i === 0)
			dot.style.opacity = 1;

		indicators.append(dot);
		dots.push(dot);
	}

	/* Переключить слайд (обновить элементы слайда) */
	function switchSlide() {
		current.innerText = (slides.length < 10) ? `0${slideIndex}` : slideIndex;
		slidesField.style.transform = `translateX(-${offset}px)`;
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	}

	const deleteNotDigits = (str) => +str.replace(/\D/g, '');

	/* Переключить слайд на следующую по нажатию стрелки вправо */
	next.addEventListener('click', () => {
		slideIndex++;
		if (slideIndex > slides.length)
			slideIndex = 1;

		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}

		switchSlide();
	})

	/* Переключить слайд на предыдущую по нажатию стрелки влево */
	prev.addEventListener('click', () => {
		slideIndex--;
		if (slideIndex < 1)
			slideIndex = slides.length;

		if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		switchSlide();
	})

	/* Переключить слайд при нажатии на индикаторы */
	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideIndex - 1)

			switchSlide();
		})
	})
}

module.exports = slider;
