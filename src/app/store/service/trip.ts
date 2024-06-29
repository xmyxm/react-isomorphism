import { queryTripMenuList, queryTripDetailList } from './base/trip'

// 查询文旅名录
async function getTripMenuList(params, ctx) {
	try {
		const menuList = await queryTripMenuList(params, ctx)
		console.log('请求响应', JSON.stringify(menuList || {}))
		if (menuList && menuList.code === 200) {
			return menuList.data
		}
		return null
	} catch (err: any) {
		console.log('请求天气信息异常', err.message)
	}
	return null
}

// 查询文旅详情
async function getTripDetailList(params, ctx) {
	try {
		const detailList = await queryTripDetailList(params, ctx)
		console.log('请求响应', JSON.stringify(detailList || {}))
		if (detailList && detailList.code === 200) {
			return detailList.data
		}
		return null
	} catch (err: any) {
		console.log('请求天气信息异常', err.message)
	}
	return null
}

export default {
	getTripMenuList,
	getTripDetailList,
}
