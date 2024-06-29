/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// const NodeModule = require('module')
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const React = require('react')
const mustache = require('mustache')
const { Helmet } = require('react-helmet')
const serialize = require('serialize-javascript')
const { renderToString } = require('react-dom/server')
const routerConfig = require('../config/router')
const print = require('../util/print-log')

// 页面优先走ssl逻辑
function render(router, fsMap) {
	async function middleware(ctx, next) {
		const urlPath = ctx.path
		try {
			const baseServerPath = path.resolve(__dirname, `../../../dist/server`)
			const jsFilePath = `${baseServerPath}/${urlPath}.js`
			if (fsMap.serverFS.existsSync(jsFilePath)) {
				const code = fsMap.serverFS.readFileSync(jsFilePath, 'utf8')

				// 检查文件夹路径是否存在
				if (!fs.existsSync(baseServerPath)) {
					// 如果文件夹路径不存在，使用 mkdirSync 创建文件夹
					// recursive: true 参数确保创建所有必需的父文件夹
					fs.mkdirSync(baseServerPath, { recursive: true })
				}
				const tempTestFilePath = `${baseServerPath}/${urlPath}_test.js`
				require('fs').writeFileSync(tempTestFilePath, code, 'utf8')

				// 准备沙盒环境中的 module 和 exports 对象
				const sandboxModule = { exports: {} }

				const sandbox = {
					module: sandboxModule,
					exports: sandboxModule.exports,
					require, // 你可以提供一个自定义的 require 函数，或直接使用 Node.js 的 require
					console, // 如果脚本中有 console.log 或其他 console 方法
					React, // 提供 React
					// ...其他你想要在沙盒中提供的全局变量或模块
				}

				// 创建沙盒上下文
				vm.createContext(sandbox)
				// 创建一个 Script 实例并运行它
				/// const script = new vm.Script(code, { filename: `server_ssr_${urlPath}.js` })
				vm.runInContext(code, sandbox)

				const { default: pageComponent } = sandbox.exports || sandbox.module.exports
				if (pageComponent.sslLoad) {
					await pageComponent.sslLoad()
				}
				let initalState = null
				if (pageComponent.sslState) {
					initalState = pageComponent.sslState()
				}
				const contentHtml = renderToString(pageComponent())
				// console.log(contentHtml)
				// 创建一个沙箱环境
				// const sandbox = { module: {}, console, require, process, global }
				// vm.createContext(sandbox)

				// // 在沙箱中执行脚本
				// const compiledWrapper = script.runInNewContext(sandbox)
				// console.log(compiledWrapper)
				// 现在沙箱对象包含了文件中定义的方法，假设方法名为 myFunction
				// const contentHtml = sandbox.default()
				const stateHtml = `<script type="text/javascript">
					window.__INITIAL_STATE__ = ${serialize(initalState || {}, { isJSON: true })}
				</script>`
				const htmlFilePath = path.resolve(__dirname, `../../../dist/client${urlPath}.html`)
				if (fsMap.clientFS.existsSync(htmlFilePath)) {
					const template = fsMap.clientFS.readFileSync(htmlFilePath, 'utf-8')
					const head = Helmet.renderStatic()
					const headHtml = `
					${head.meta.toString()}\n
					${head.link.toString()}\n
					${head.title.toString()}\n
				`
					const pageHtml = mustache.render(template, {
						reactSSRHead: headHtml,
						reactSSRBody: contentHtml + stateHtml,
					})
					ctx.body = pageHtml
				} else {
					const msg = `路径：${ctx.path} 页面html不存在`
					ctx.status = 405
					ctx.body = msg
					print.warn(msg)
				}
			} else {
				const msg = `路径：${ctx.path} 页面js不存在`
				ctx.status = 404
				ctx.body = msg
				print.error(msg)
			}
		} catch (err) {
			console.error('服务端渲染异常：', err.message)
		} finally {
			next()
		}
	}

	const methods = ['HEAD', 'OPTIONS', 'GET', 'POST']
	routerConfig.PAGE.forEach(jsFilePath => {
		router.register(jsFilePath, methods, middleware)
	})
}

module.exports = render
