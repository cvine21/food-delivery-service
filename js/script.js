'use strict'

window.addEventListener('DOMContentLoaded', function () {

	// ************************************************************************** //
	//                                   Tabs                                     //
	// ************************************************************************** //

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

	// ************************************************************************** //
	//                                   Timer                                    //
	// ************************************************************************** //

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

	// ************************************************************************** //
	//                                   Modal                                    //
	// ************************************************************************** //

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

	// ************************************************************************** //
	//                              MenuCard Class                                //
	// ************************************************************************** //

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

	/* Отрендерить данные полученные с сервера */
	getResource('http://localhost:3000/menu')
	.then(data => {
		data.forEach(({img, altimg, title, descr, price}) => {
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
		})
	});
	
	// ************************************************************************** //
	//                                   Form                                     //
	// ************************************************************************** //

	/*Отправка данных, введнных пользователем в форме, на json-server*/

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
});

// ************************************************************************** //
//                                  Slider                                    //
// ************************************************************************** //

let offset = 0;
let slideIndex = 1;

const slides = document.querySelectorAll('.offer__slide'),
	prev = document.querySelector('.offer__slider-prev'),
	next = document.querySelector('.offer__slider-next'),
	total = document.querySelector('#total'),
	current = document.querySelector('#current'),
	slidesWrapper = document.querySelector('.offer__slider-wrapper'),
	slidesField = document.querySelector('.offer__slider-inner'),
	width = window.getComputedStyle(slidesWrapper).width;

current.innerText = (slides.length < 10) ? `0${slideIndex}` : slideIndex;
total.innerText = (slides.length < 10) ? `0${slides.length}` : slides.length;

slidesField.style.width = 100 * slides.length + '%';
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';

slidesWrapper.style.overflow = 'hidden';

slides.forEach(slide => {
	slide.style.width = width;
});

next.addEventListener('click', () => {
	if (offset == -width.slice(0, width.length - 2) * (slides.length - 1)) {
		offset = 0;
	} else {
		offset -= +width.slice(0, width.length - 2);
	}
	slidesField.style.transform = `translateX(${offset}px)`;

	slideIndex++;
	if (slideIndex > slides.length)
		slideIndex = 1;

	current.innerText = (slides.length < 10) ? `0${slideIndex}` : slideIndex;
})

prev.addEventListener('click', () => {
	if (offset == 0) {
		offset = -width.slice(0, width.length - 2) * (slides.length - 1);
	} else {
		offset += +width.slice(0, width.length - 2);
	}
	slidesField.style.transform = `translateX(${offset}px)`;
	
	slideIndex--;
	if (slideIndex < 1)
		slideIndex = slides.length;

	current.innerText = (slides.length < 10) ? `0${slideIndex}` : slideIndex;
})
