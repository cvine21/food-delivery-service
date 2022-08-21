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