// ************************************************************************** //
//                                   Timer                                    //
// ************************************************************************** //

function timer(id, deadline) {
	/*  Получить объект, содержащий оставшееся время */
	function getTimeRemaining(endtime) {
		const total = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(total / (1000 * 60 * 60 * 24)),
			hours = Math.floor((total / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((total / (1000 * 60)) % 60),
			seconds = Math.floor((total / 1000) % 60);

		return { total, days, hours, minutes, seconds };
	}

	/* Установить таймер в формате двузначного числа с 0 */
	function getZero(num) {
		return num >= 0 && num < 10 ? `0${num}` : num;
	}

	/* Запустить таймер */
	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector("#hours"),
			minutes = timer.querySelector("#minutes"),
			seconds = timer.querySelector("#seconds"),
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

	setClock(id, deadline);
}

export default timer;
