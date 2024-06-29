import axios from 'axios'

// 查询天气信息
// eslint-disable-next-line no-unused-vars
export const queryWeatherInfo = (_params, ctx) => {
	const href = `${ctx ? 'http://127.0.0.1:8080' : ''}/api/getWeather`
	return axios({
		url: href,
		method: 'get',
	}).then(response => {
		return response.data
	})
}
