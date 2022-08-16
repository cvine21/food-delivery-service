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
	const modalTimerId = setTimeout(openModal, 5000);

	/* Открыть модальное окно при пролистывании странии до конца (-1px, потому что без него может не отрабатывать на некоторых браузерах по неизвестным причинам) */
	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);
});