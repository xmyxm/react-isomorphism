/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// const NodeModule = require('module')
const vm = require('vm')
const nodeFs = require('fs')
const path = require('path')
const mustache = require('mustache')
const { Helmet } = require('react-helmet')
const print = require('../util/print-log')

// 页面优先走ssl逻辑
function pageSSR(serverFs) {
	function middleware(ctx, next) {
		const urlPath = ctx.path
		try {
			const jsFilePath = path.resolve(__dirname, `../../../dist/server${urlPath}.js`)
			const fs = serverFs || nodeFs
			if (fs.existsSync(jsFilePath)) {
				const tempTestFilePath = path.resolve(__dirname, `../../../dist/server${urlPath}_test.js`)
				const code = fs.readFileSync(tempTestFilePath, 'utf8')

				require('fs').writeFileSync('output.js', code, 'utf8')
				// const wrapper = NodeModule.wrap(code)
				// // 创建一个新的脚本
				// const script = new vm.Script(wrapper, {
				// 	filename: `${urlPath}.js`,
				// 	displayErrors: true,
				// })
				// const m = { exports: {} }
				// const compiledWrapper = script.runInThisContext({ exports: {} })

				// compiledWrapper.call(m.exports, m.exports, require, m)
				// const res = Object.prototype.hasOwnProperty.call(m.exports, 'default') ? m.exports.default : m.exports
				// console.log(res)

				// 准备沙盒环境中的 module 和 exports 对象
				const sandboxModule = { exports: {} }
				const sandbox = {
					module: sandboxModule,
					exports: sandboxModule.exports,
					require, // 你可以提供一个自定义的 require 函数，或直接使用 Node.js 的 require
					console, // 如果脚本中有 console.log 或其他 console 方法
					// ...其他你想要在沙盒中提供的全局变量或模块
				}

				// 创建沙盒上下文
				vm.createContext(sandbox)
				// 创建一个 Script 实例并运行它
				const script = new vm.Script(code, { filename: 'script.js' })
				script.runInContext(sandbox)

				// 现在你可以访问沙盒环境中的 module.exports
				const exportedValues = sandbox.module.exports

				console.log(exportedValues)

				// 创建一个沙箱环境
				// const sandbox = { module: {}, console, require, process, global }
				// vm.createContext(sandbox)

				// // 在沙箱中执行脚本
				// const compiledWrapper = script.runInNewContext(sandbox)
				// console.log(compiledWrapper)
				// 现在沙箱对象包含了文件中定义的方法，假设方法名为 myFunction
				// const contentHtml = sandbox.default()

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
						reactSSRBody: '', // contentHtml,
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
