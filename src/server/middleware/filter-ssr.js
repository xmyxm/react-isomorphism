/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const { Helmet } = require('react-helmet')
const print = require('../util/print-log')

// 页面优先走ssl逻辑
async function pageSSR(ctx, next) {
	const urlPath = ctx.path
	try {
		const jsFilePath = path.resolve(__dirname, `../../../dist/server${urlPath}.js`)
		if (fs.existsSync(jsFilePath)) {
			const contentHtml = require(jsFilePath).default()
			const htmlFilePath = path.resolve(__dirname, `../../../dist/client${urlPath}.html`)
			if (fs.existsSync(htmlFilePath)) {
				const template = fs.readFileSync(htmlFilePath, 'utf-8')
				const head = Helmet.renderStatic()
				const headHtml = `
					${head.meta.toString()}\n
					${head.link.toString()}\n
					${head.title.toString()}\n
				`
				const pageHtml = template.replace('react-ssr-head', headHtml).replace('react-ssr-body', contentHtml)
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

module.exports = pageSSR
