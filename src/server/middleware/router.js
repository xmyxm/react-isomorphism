/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const Router = require('@koa/router')
const routerConfig = require('../config/router')

// api 逻辑
function initRouter() {
	const router = new Router()
	const methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE']
	try {
		Object.keys(routerConfig.API).forEach(key => {
			const actionName = routerConfig.API[key]
			if (actionName) {
				const actionPath = path.join(__dirname, `../action/${actionName}.js`)
				if (fs.existsSync(actionPath)) {
					const action = require(actionPath)
					if (action) {
						// 命中执行了 API Action 后就无需再执行后续的 next 中间件
						// router.register(key, methods, async (ctx, next) => {
						// 	await action(ctx)
						// 	await next()
						// })
						router.register(key, methods, action)
					}
				}
			}
		})
	} catch (err) {
		console.error('api执行异常：', err.message)
	}
	return router
}

module.exports = initRouter
