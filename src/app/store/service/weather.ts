import { queryWeatherInfo } from './base/weather'

// 获取商户基础信息
async function getWeatherInfo(params, ctx) {
	try {
		const weatherInfo = await queryWeatherInfo(params, ctx)
		console.log('------------------------ 请求响应', JSON.stringify(weatherInfo || {}))
		if (weatherInfo && weatherInfo.code === 200) {
			return weatherInfo.data
		}
		return null
	} catch (err: any) {
		console.log('请求天气信息异常', err.message)
	}
	return null
}

export default {
	getWeatherInfo,
}
