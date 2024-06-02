/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')

// api 逻辑
async function api(ctx, next) {
	try {
		const jsFilePath = path.resolve(__dirname, `../action/${ctx.path.replace('/api/', '')}.js`)
		if (fs.existsSync(jsFilePath)) {
			const action = require(jsFilePath)
			action(ctx, next)
		}
	} catch (err) {
		console.error('api执行异常：', err.message)
	} finally {
		next()
	}
}

module.exports = api
