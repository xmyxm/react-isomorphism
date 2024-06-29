const axios = require('axios')

async function getWeather(ctx) {
	// 国家气象中心：http://m.nmc.cn/publish/forecast/AHB/wuhan.html
	// 武汉 57494、上海 58367、荆门 57377
	const { cityid = 57494 } = ctx.query

	const result = {
		code: 200,
		data: {},
		msg: '成功',
	}

	const url = `http://www.nmc.cn/rest/real/${cityid}`

	// const headers = {
	// 	Accept: 'application/json, text/javascript, */*; q=0.01',
	// 	'Accept-Encoding': 'gzip, deflate',
	// 	'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
	// 	'Cache-Control': 'no-cache',
	// 	Connection: 'keep-alive',
	// 	Host: 'www.nmc.cn',
	// 	Origin: 'http://m.nmc.cn',
	// 	Pragma: 'no-cache',
	// 	Referer: 'http://m.nmc.cn/',
	// 	'User-Agent':
	// 		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	// }

	const weatherInfo = await axios({
		method: 'get',
		// headers,
		url,
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
