export const secret = '2022';

export function getUrlParam(name: string): string {
	const query = window.location.search.substring(1);
	const vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split('=');
		if (pair[0] === name) {
			return decodeURIComponent(pair[1]);
		}
	}
	return '';
}

function getNumText(num: number): string {
	return num > 9 ? `${num}` : `0${num}`;
}

export function getDateNowText(): string {
	const date = new Date();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const seconds = date.getSeconds();
	return `${getNumText(hour)}:${getNumText(minute)}:${getNumText(seconds)}`;
}

export function getDateText(num: number): string {
	const date = new Date(num);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const seconds = date.getSeconds();
	return `${year}/${getNumText(month)}/${getNumText(day)} ${getNumText(
		hour,
	)}:${getNumText(minute)}:${getNumText(seconds)}`;
}

export default {
	getUrlParam,
	getDateText,
	getDateNowText,
};
