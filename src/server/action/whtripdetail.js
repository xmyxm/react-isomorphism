const axios = require('axios')
const config = require('../config/trip/wuhan')

async function getWuHanTripDetail(ctx) {
	const { id = 1719648013466 } = ctx.query

	const result = {
		code: 200,
		data: null,
		msg: '成功',
	}

	const item = config.list.find(({ id: key }) => id === `${key}`)
	let name = ''
	let api = ''
	let renderConfig = null
	if (item) {
		name = item.name
		api = item.api
		renderConfig = item.renderConfig
	}

	if (api) {
		const tripData = await axios
			.get(`${api}?_=${id}`)
			.then(response => {
				// eslint-disable-next-line no-param-reassign
				return response.data
			})
			.catch(err => {
				result.msg = err.message
				console.log(err)
			})
		if (tripData && tripData.data) {
			result.data = {
				title: name,
				renderConfig,
				list: tripData.data,
			}
		}
	}

	ctx.body = result
}

module.exports = getWuHanTripDetail
