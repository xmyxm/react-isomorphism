/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const vm = require('vm')
const nodeFs = require('fs')
const path = require('path')
const mustache = require('mustache')
const { Helmet } = require('react-helmet')
const print = require('../util/print-log')

// 页面优先走ssl逻辑
function pageSSR(webpackFs) {
	function middleware(ctx, next) {
		const urlPath = ctx.path
		try {
			const jsFilePath = path.resolve(__dirname, `../../../dist/server${urlPath}.js`)
			const fs = webpackFs || nodeFs
			if (fs.existsSync(jsFilePath)) {
				const code = fs.readFileSync(jsFilePath, 'utf8')
				// 创建一个新的脚本
				const script = new vm.Script(code)

				// 创建一个沙箱环境
				const sandbox = {}
				vm.createContext(sandbox)

				// 在沙箱中执行脚本
				script.runInContext(sandbox)

				// 现在沙箱对象包含了文件中定义的方法，假设方法名为 myFunction
				const contentHtml = sandbox.default()

				const htmlFilePath = path.resolve(__dirname, `../../../dist/client${urlPath}.html`)
				if (fs.existsSync(htmlFilePath)) {
					const template = fs.readFileSync(htmlFilePath, 'utf-8')
					const head = Helmet.renderStatic()
					const headHtml = `
					${head.meta.toString()}\n
					${head.link.toString()}\n
					${head.title.toString()}\n
				`
					const pageHtml = mustache.render(template, {
						reactSSRHead: headHtml,
						reactSSRBody: contentHtml,
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

	return middleware
}

module.exports = pageSSR
