import axios from 'axios'

// 查询天气信息
export const queryWeatherInfo = (params, ctx) => {
	const href = `http://127.0.0.1:8080/api/getWeather`
	return axios({
		url: href,
		method: 'get',
	}).then(response => {
		return response.data
	})
}
