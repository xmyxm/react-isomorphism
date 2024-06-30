const config = require('../config/trip/wuhan')

async function getWuHanTrip(ctx) {
	const data = {
		...config,
	}
	data.list = data.list.map(({ name, id }) => ({ name, id }))
	const result = {
		code: 200,
		data: config,
		msg: '成功',
	}
	ctx.body = result
}

module.exports = getWuHanTrip
