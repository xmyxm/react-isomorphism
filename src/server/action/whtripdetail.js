const axios = require('axios')
const config = require('../config/trip/wuhan')

async function getWuHanTrip(ctx) {
	const result = {
		code: 200,
		data: config,
		msg: '成功',
	}

	const promiseList = []
	config.list.forEach(item => {
		promiseList.push(
			axios
				.get(`https://wlj.wuhan.gov.cn/bsfw_27/wlml/lyjq/list.json?_=${item.id}`)
				.then(response => {
					// eslint-disable-next-line no-param-reassign
					item.data = response.data
				})
				.catch(err => {
					console.log(err)
				}),
		)
	})
	await Promise.all(promiseList)
	ctx.body = result
}

module.exports = getWuHanTrip
