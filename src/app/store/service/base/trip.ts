import axios from 'axios'

// 查询文旅名录
// eslint-disable-next-line no-unused-vars
export const queryTripMenuList = (_params, ctx) => {
	const href = `${ctx ? 'http://127.0.0.1:8080' : ''}/api/whtrip`
	return axios({
		url: href,
		method: 'get',
	}).then(response => {
		return response.data
	})
}

// 查询文旅详情
export const queryTripDetailList = (_params, ctx) => {
	const { id = '' } = _params
	const href = `${ctx ? 'http://127.0.0.1:8080' : ''}/api/whtripdetail?id=${id}`
	return axios({
		url: href,
		method: 'get',
	}).then(response => {
		return response.data
	})
}
