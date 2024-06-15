const serve = require('koa-static')
const path = require('path')

// 开启 gzip
const gzip = true
// 浏览器缓存 max-age 以毫秒为单位，设置强缓存有效期 10s
const maxage = 1000 * 10

// 静态资源服务
module.exports = {
	projectStatic: serve(path.resolve(__dirname, '../../../dist/client/'), {
		index: false, // 默认 index.html，不指定空即为 csr
		gzip,
		maxage,
		setHeaders: res => {
			console.log(`返回 client 文件: ${res.req.url}`)
		},
	}),
	commonStatic: serve(path.resolve(__dirname, '../../../webfile/'), {
		index: false,
		gzip,
		maxage,
		setHeaders: res => {
			console.log(`返回 webfile 文件: ${res.req.url}`)
		},
	}),
}
