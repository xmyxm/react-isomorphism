const axios = require('axios')

async function getWeather(ctx) {
	// 灯塔一组 经度112.1450944°，纬度31.2990765°
	// 雅居乐 经度114.3863532°，纬度30.4079140°
	const { lat = '30.4079140', lon = '114.3863532', type = '0' } = ctx.query

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
		.then(response => {
			return response.data
		})
		.catch(err => {
			result.msg = err.message
			console.log(err)
			return null
		})
	result.data = weatherInfo

	ctx.body = result
}

module.exports = getWeather
