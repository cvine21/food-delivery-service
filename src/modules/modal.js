// ************************************************************************** //
//                                   Modal                                    //
// ************************************************************************** //

/* Открыть модальное окно */
function openModal(modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add("show");
	modal.classList.remove("hide");
	document.body.style.overflow = "hidden";
	if (modalTimerId) clearInterval(modalTimerId);
}

/* Закрыть модальное окно */
function closeModal(modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add("hide");
	modal.classList.remove("show");
	document.body.style.overflow = "";
}

function modal(triggerSelector, modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector),
		modalTrigger = document.querySelectorAll(triggerSelector);

	/* Открыть модальное окно при нажатии на кнопку "Связаться с нами" */
	modalTrigger.forEach((item) => {
		item.addEventListener("click", () => {
			openModal(modalSelector, modalTimerId);
		});
	});

	/* Закрыть модальное окно при нажатии на крестик или пустое пространство вокруг окна */
	modal.addEventListener("click", (e) => {
		if (e.target === modal || e.target.getAttribute("data-close") === "") {
			closeModal(modalSelector);
		}
	});

	/* Закрыть модальное окно при нажатии на Escape */
	document.addEventListener("keydown", (e) => {
		if (e.code === "Escape" && modal.classList.contains("show")) {
			closeModal(modalSelector);
		}
	});

	/* Открыть модальное окно при пролистывании странии до конца (-1px, потому что без него может не отрабатывать на некоторых браузерах по неизвестным причинам) */
	function showModalByScroll() {
		if (
			window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1
		) {
			openModal(modalSelector, modalTimerId);
			window.removeEventListener("scroll", showModalByScroll);
		}
	}

	window.addEventListener("scroll", showModalByScroll);
}

export default modal;
export { openModal };
export { closeModal };
