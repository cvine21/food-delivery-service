// ************************************************************************** //
//                                   Form                                     //
// ************************************************************************** //

import { closeModal, openModal } from './modal';
import {postData} from '../services/services';

/*Отправка данных, введнных пользователем в форме, на json-server*/
function forms(formSelector, modalTimerId) {
	const forms = document.querySelectorAll(formSelector);

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	}

	forms.forEach(item => bindPostData(item));

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
		openModal('.modal', modalTimerId);

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
			closeModal('.modal');
		}, 4000);
	}
}

export default forms;
