const axios = require('axios')
const config = require('../config/trip/wuhan')

async function getWuHanTripDetail(ctx) {
	const { id = 1719648013466 } = ctx.query

	const result = {
		code: 200,
		data: null,
		msg: '成功',
	}

	const tripData = await axios
		.get(`https://wlj.wuhan.gov.cn/bsfw_27/wlml/lyjq/list.json?_=${id}`)
		.then(response => {
			// eslint-disable-next-line no-param-reassign
			return response.data
		})
		.catch(err => {
			result.msg = err.message
			console.log(err)
		})
	if (tripData && tripData.data) {
		const item = config.list.find(({ id: key }) => id === `${key}`)
		let name = ''
		let renderConfig = null
		if (item) {
			name = item.name
			renderConfig = item.renderConfig
		}
		result.data = {
			title: name,
			renderConfig,
			list: tripData.data,
		}
	}
	ctx.body = result
}

module.exports = getWuHanTripDetail
