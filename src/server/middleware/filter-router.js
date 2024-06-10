/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const Router = require('@koa/router')

// api 逻辑
function initRouter() {
	const router = new Router()
	const methods = ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE']
	try {
		const routerFilePath = path.join(__dirname, '../config/router.js')
		if (fs.existsSync(routerFilePath)) {
			// 单文件
			const routerConfigMap = require(routerFilePath)
			Object.keys(routerConfigMap).forEach(key => {
				const actionName = routerConfigMap[key]
				if (actionName) {
					const actionPath = path.join(__dirname, `../action/${actionName}.js`)
					if (fs.existsSync(actionPath)) {
						const action = require(actionPath)
						if (action) {
							router.register(key, methods, action)
						}
					}
				}
			})
		}
	} catch (err) {
		console.error('api执行异常：', err.message)
	}
	return router
}

module.exports = initRouter
