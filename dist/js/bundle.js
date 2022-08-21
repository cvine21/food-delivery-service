/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

// ************************************************************************** //
//                                Calculator                                  //
// ************************************************************************** //

function calc() {
	const result = document.querySelector('.calculating__result span');

	let sex, height, weight, age, ratio;

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	} else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	} else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}

	function initLocalActiveClasses(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeClass);
			}
		});
	}

	initLocalActiveClasses('#gender div', 'calculating__choose-item_active');
	initLocalActiveClasses('.calculating__choose_big div', 'calculating__choose-item_active');

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____';
			return;
		}
		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	calcTotal();

	function getStaticInformation(selector, activeClass) {
		const elements = document.querySelectorAll(selector);
		elements.forEach(elem => {
			elem.addEventListener('click', (e) => {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				} else {
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex', e.target.getAttribute('id'));
				}

				elements.forEach(elem => {
					elem.classList.remove(activeClass);
				});

				e.target.classList.add(activeClass);

				calcTotal();
			});
		});
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);
		input.addEventListener('input', () => {
			if (input.value.match(/\D/g)) {
				input.style.border = "1px solid red";
			} else {
				input.style.border = 'none';
			}
			switch (input.getAttribute('id')) {
				case "height":
					height = +input.value;
					break;
				case "weight":
					weight = +input.value;
					break;
				case "age":
					age = +input.value;
					break;
			}

			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

// ************************************************************************** //
//                              MenuCard Class                                //
// ************************************************************************** //

function cards() {
	class MenuCard {
		constructor(src, alt, title, descr, priceUSD, parentSelector, ...classes) {
			this.src = src;
			this.title = title;
			this.title = title;
			this.descr = descr;
			this.price = priceUSD;
			this.parent = document.querySelector(parentSelector);
			this.classes = classes;
			this.transfer = 61;
			this.changeToRUB();
		}

		/* USD to RUB */
		changeToRUB() {
			this.price *= this.transfer;
		}

		/* Отрендерить карточку */
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.classes = 'menu__item';
				element.classList.add(this.classes);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}
			element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> руб/день</div>
					</div>
				`;
			this.parent.append(element);
		}
	}

	/* Отрендерить данные карточек, полученные с сервера */
	getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({ img, altimg, title, descr, price }) => {
				new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			})
		});
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

// ************************************************************************** //
//                                   Form                                     //
// ************************************************************************** //

/*Отправка данных, введнных пользователем в форме, на json-server*/
function forms() {
	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	}

	forms.forEach(item => bindPostData(item));

	/* Отправить данные на JSON сервер. */
	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: data
		});

		return await res.json();
	}

	/* Получить данные с сервера */
	async function getResource(url) {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	}

	/* Привязять данные к запросу на сервер */
	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			/* Отобразить спиннер  загрузки */
			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
					display: block;
					margin: 0 auto;`;
			form.insertAdjacentElement("afterend", statusMessage);

			/* Собрать данные с формы в формате FormData*/
			const formData = new FormData(form);

			/* Сконвертировать данные из FormData в JSON строку */
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			/*Отправить запрос, вывести соответвсующее сообщение статуса запроса и очистить форму в любом случае.*/
			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => showThanksModal(message.failure))
				.finally(() => form.reset());
		});
	}

	/* Отобразить сообщение статуса отправки */
	function showThanksModal(message) {
		const prevMovalDialog = document.querySelector('.modal__dialog');

		prevMovalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
				<div class="modal__content">
					<div data-close="" class="modal__close">×</div>
					<div class="modal__title">${message}</div>
				</div>`;
		document.querySelector('.modal').append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevMovalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}
}

module.exports = forms;


/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

// ************************************************************************** //
//                                   Modal                                    //
// ************************************************************************** //

function modal() {
	const modal = document.querySelector('.modal'),
		modalTrigger = document.querySelectorAll('[data-modal]');
	
	/* Открыть модальное окно */
	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		/* Отменить скролл */
		document.body.style.overflow = 'hidden';
		/* Очистить интервал, если окно уже было открыто */
		clearInterval(modalTimerId);
	}
	
	/* Открыть модальное окно при нажатии на кнопку "Связаться с нами" */
	modalTrigger.forEach(item => {
		item.addEventListener('click', () => {
			openModal();
		});
	});
	
	/* Закрыть модальное окно */
	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		/* Вернуть скролл (браузер сам догадается, какое значение подставить в пустую строку) */
		document.body.style.overflow = '';
	}
	
	/* Закрыть модальное окно при нажатии на крестик или пустое пространство вокруг окна */
	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') === '') {
			closeModal();
		}
	})
	
	/* Закрыть модальное окно при нажатии на Escape */
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});
	
	/* Открыть модальное окно через заданный временной интервал */
	const modalTimerId = setTimeout(openModal, 50000);
	
	/* Открыть модальное окно при пролистывании странии до конца (-1px, потому что без него может не отрабатывать на некоторых браузерах по неизвестным причинам) */
	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}
	
	window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

// ************************************************************************** //
//                                   Tabs                                     //
// ************************************************************************** //

function tabs() {
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {

		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', function (event) {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
}

module.exports = tabs;


/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

// ************************************************************************** //
//                                   Timer                                    //
// ************************************************************************** //

function timer() {
	const deadline = '2022-09-06';

	/*  Получить объект, содержащий оставшееся время: общее, дни, часы, минуты, секунды */
	function getTimeRemaining(endtime) {
		const total = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(total / (1000 * 60 * 60 * 24)),
			hours = Math.floor(total / (1000 * 60 * 60) % 24),
			minutes = Math.floor(total / (1000 * 60) % 60),
			seconds = Math.floor(total / 1000 % 60);

		return { total, days, hours, minutes, seconds };
	}

	/* Доп. функция, чтобы  установить таймер в формате двузначного числа с 0 */
	function getZero(num) {
		return (num >= 0 && num < 10) ? `0${num}` : num;
	}

	/* Запустить таймер */
	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		/* Чтобы не ждать 1000 мс при первом вызове setInterval вызываем updateClock заранее */
		updateClock();

		/* Обновить значения таймера (в связке с setInterval) */
		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/


window.addEventListener('DOMContentLoaded', () => {
	const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
		modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
		timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
		cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
		calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
		forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
		slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");

	tabs();
	modal();
	timer();
	cards();
	calc();
	forms();
	slider();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map