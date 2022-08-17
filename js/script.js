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
		modalTrigger = document.querySelectorAll('[data-modal]'),
		modalCloseBtn = document.querySelector('[data-close]');

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

	/* Закрыть модальное окно при нажатии на крестик */
	modalCloseBtn.addEventListener('click', (e) => {
		closeModal();
	});

	/* Закрыть модальное окно при нажатии на пустое пространство вокруг него */
	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
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
	// const modalTimerId = setTimeout(openModal, 5000);

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

	new MenuCard('img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		9,
		'.menu .container'
	).render();

	new MenuCard('img/tabs/elite.jpg',
		'elite',
		'Меню "Фитнес"',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		21,
		'.menu .container',
		'menu__item'
	).render();

	new MenuCard('img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
		14,
		'.menu .container',
		'menu__item'
	).render()

	// ************************************************************************** //
	//                                   Form                                     //
	// ************************************************************************** //

	/*Отправка данных, введнных пользователем в форме*/

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'Загрузка',
		success: 'Спасибо мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	}

	forms.forEach(item => postData(item));

	/* Отправить POST-запрос */
	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			/* Вывести статус отправки формы */
			const statusMessage = document.createElement('div');
			statusMessage.classList.add('status');
			statusMessage.textContent = message.loading;
			form.append(statusMessage);

			/* 
			Cоздать запрос, настроить с помощью open, создать заголовок с помощью setRequestHeader.
			Формат FormData собирает все значения с input, используя атрибут name в качестве ключа
			*/
			const request = new XMLHttpRequest();
			request.open('POST', 'server.php');
			request.setRequestHeader('Content-type', 'multipart/JSON');
			const formData = new FormData(form);

			/* Сконвертировать данные из FormData в JSON */
			const object = {};
			formData.forEach((value, key) => object[key] = value);

			/* Отправить данные на сервер */
			request.send(JSON.stringify(object));

			/* Событие-ответ на отправку формы */
			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response);
					statusMessage.textContent = message.success;

					/* Очистить поля ввода и сообщение статуса */
					form.reset();
					setTimeout(() => statusMessage.remove(), 2000);
				} else {
					statusMessage.textContent = message.failure;
				}
			})
		});
	}
});
