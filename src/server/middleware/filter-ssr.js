/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// const NodeModule = require('module')
const vm = require('vm')
// const fs = require('fs')
const path = require('path')
const React = require('react')
const mustache = require('mustache')
const { renderToString } = require('react-dom/server')
const { Helmet } = require('react-helmet')
const print = require('../util/print-log')

// 页面优先走ssl逻辑
function pageSSR(fsMap = {}) {
	const { serverFS, clientFS } = fsMap
	function middleware(ctx, next) {
		const urlPath = ctx.path
		try {
			const baseServerPath = path.resolve(__dirname, `../../../dist/server`)
			const jsFilePath = `${baseServerPath}/${urlPath}.js`
			if (serverFS.existsSync(jsFilePath)) {
				const code = serverFS.readFileSync(jsFilePath, 'utf8')
				const serverFiles = serverFS.readdirSync(baseServerPath)
				serverFiles.forEach(file => {
					console.log(file)
				})

				// 检查文件夹路径是否存在
				// if (!fs.existsSync(baseServerPath)) {
				// 	// 如果文件夹路径不存在，使用 mkdirSync 创建文件夹
				// 	// recursive: true 参数确保创建所有必需的父文件夹
				// 	fs.mkdirSync(baseServerPath, { recursive: true })
				// }
				// const tempTestFilePath = `${baseServerPath}/${urlPath}_test.js`
				// require('fs').writeFileSync(tempTestFilePath, code, 'utf8')

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
					React, // 提供 React
					// ...其他你想要在沙盒中提供的全局变量或模块
				}

				// 创建沙盒上下文
				vm.createContext(sandbox)
				// 创建一个 Script 实例并运行它
				/// const script = new vm.Script(code, { filename: `server_ssr_${urlPath}.js` })
				vm.runInContext(code, sandbox)

				// const pageComponent = sandbox.exports.default()
				const pageComponent = sandbox.module.exports.default()
				const contentHtml = renderToString(pageComponent)
				// console.log(contentHtml)
				// 创建一个沙箱环境
				// const sandbox = { module: {}, console, require, process, global }
				// vm.createContext(sandbox)

				// // 在沙箱中执行脚本
				// const compiledWrapper = script.runInNewContext(sandbox)
				// console.log(compiledWrapper)
				// 现在沙箱对象包含了文件中定义的方法，假设方法名为 myFunction
				// const contentHtml = sandbox.default()

				const baseClientPath = path.resolve(__dirname, `../../../dist/client`)
				const htmlFilePath = `${baseClientPath}${urlPath}.html`
				// const files = clientFS.readdirSync(baseClientPath)
				// // 打印文件夹内容列表
				// files.forEach(file => {
				// 	console.log(file)
				// })

				// 获取所有文件的路径
				// const files = getAllFilesFromMemoryFs(clientFS, baseClientPath)

				// console.log(files)

				// 递归函数来获取所有文件
				// eslint-disable-next-line no-inner-declarations
				// function getAllFilesFromMemoryFs(fs, dirPath, arrayOfFiles) {
				// 	const files = fs.readdirSync(dirPath)
				// 	arrayOfFiles = arrayOfFiles || []

				// 	files.forEach(function (file) {
				// 		if (fs.statSync(dirPath + '/' + file).isDirectory()) {
				// 			arrayOfFiles = getAllFilesFromMemoryFs(fs, dirPath + '/' + file, arrayOfFiles)
				// 		} else {
				// 			arrayOfFiles.push(path.join(dirPath, '/', file))
				// 		}
				// 	})

				// 	return arrayOfFiles
				// }

				function readDirectory(fs, directory) {
					// 获取当前目录下的所有文件和文件夹
					const items = fs.readdirSync(directory)
					let paths = []

					items.forEach(item => {
						const currentPath = directory + '/' + item
						const isDirectory = fs.statSync(currentPath).isDirectory()

						if (isDirectory) {
							// 如果是文件夹，递归调用
							paths = paths.concat(readDirectory(fs, currentPath))
						} else {
							// 如果是文件，添加到路径数组中
							paths.push(currentPath)
						}
					})

					return paths
				}

				// 调用 readDirectory 函数，从根目录开始递归遍历
				const allPaths = readDirectory(clientFS, baseClientPath)

				// 输出所有文件路径
				console.log(allPaths)

				if (clientFS.existsSync(htmlFilePath)) {
					const template = clientFS.readFileSync(htmlFilePath, 'utf-8')
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
