import tabs from "./modules/tabs";
import modal from "./modules/modal";
import timer from "./modules/timer";
import cards from "./modules/cards";
import calc from "./modules/calc";
import forms from "./modules/forms";
import slider from "./modules/slider";
import { openModal } from "./modules/modal";

window.addEventListener("DOMContentLoaded", () => {
	/* Время, через которое будет открываться модальное окно */
	const modalTimerId = setTimeout(
		() => openModal(".modal", modalTimerId),
		50000
	);

	tabs(
		".tabheader__item",
		".tabcontent",
		".tabheader__items",
		"tabheader__item_active"
	);
	modal("[data-modal]", ".modal", modalTimerId);
	timer(".timer", "2022-12-31");
	cards();
	calc();
	forms("form", modalTimerId);
	slider({
		slide: ".offer__slide",
		container: ".offer__slider",
		nextArrow: ".offer__slider-next",
		prevArrow: ".offer__slider-prev",
		totalCount: "#total",
		currentCounter: "#current",
		wrapper: ".offer__slider-wrapper",
		field: ".offer__slider-inner",
	});
});
