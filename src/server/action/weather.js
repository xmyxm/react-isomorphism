const axios = require('axios')

async function getWeather(ctx) {
	const { lat = '39.8000', lon = '116.4700', type = '0' } = ctx.query

	const result = {
		code: 200,
		data: {},
		msg: '成功',
	}

	const weatherInfo = await axios({
		method: 'post',
		data: { lat, lon, type },
		url: 'https://data.cma.cn/kbweb/home/live',
	})
		.then(function (response) {
			return response.data
		})
		.catch(err => {
			console.log(err)
			return null
		})
	result.data = weatherInfo

	ctx.body = result
}

module.exports = getWeather
