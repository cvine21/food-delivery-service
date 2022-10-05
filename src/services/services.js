/* Отправить данные на JSON сервер. */
const postData = async (url, data) => {
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: data,
		});

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	} catch (e) {
		console.error(e.message);
	}
};

/* Получить данные с сервера */
async function getResource(url) {
	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	} catch (e) {
		console.error(e.message);
	}
}

export { postData };
export { getResource };
