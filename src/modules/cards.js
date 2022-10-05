// ************************************************************************** //
//                              MenuCard Class                                //
// ************************************************************************** //

import { getResource } from "../services/services";

function cards() {
	class MenuCard {
		constructor(
			src,
			alt,
			title,
			descr,
			priceUSD,
			parentSelector,
			...classes
		) {
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
			const element = document.createElement("div");
			if (this.classes.length === 0) {
				this.classes = "menu__item";
				element.classList.add(this.classes);
			} else {
				this.classes.forEach((className) =>
					element.classList.add(className)
				);
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
	getResource("http://localhost:3000/menu").then((data) => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(
				img,
				altimg,
				title,
				descr,
				price,
				".menu .container"
			).render();
		});
	});
}

export default cards;
