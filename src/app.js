const fs = require('fs')
const Koa = require('koa')
const http = require('http')
const https = require('https')
const webpack = require('webpack')
const c2k = require('koa-connect')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const conditional = require('koa-conditional-get')
const WebpackDevServer = require('webpack-dev-server')
const { default: enforceHttps } = require('koa-sslify')
const devMiddleware = require('webpack-dev-middleware')
const { createProxyMiddleware } = require('http-proxy-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware');
const serverConfig = require('../webpack/webpack.server.beta.config')
const staticServer = require('./server/middleware/filter-static')
const redirect = require('./server/middleware/filter-redirect')
const betaConfig = require('../webpack/webpack.beta.config')
const pageSSR = require('./server/middleware/filter-ssr')
const actionAPI = require('./server/action/index')
const print = require('./server/util/print-log')
const RUN_ENV = require('./server/util/run-env')
const getTime = require('./server/util/util')

const { argv } = process
// 申明 Node 端口
let serverPort = 443
// 环境判断
let env = RUN_ENV.PRO

let httpServer = null

if (argv.length === 3 && argv[2] === 'dev') {
	serverPort = 8080
	env = RUN_ENV.DEV
}

const clientCompiler = webpack(betaConfig)
const server = new WebpackDevServer(betaConfig.devServer, clientCompiler)
server.startCallback(err => {
	print.info(`${getTime()} client 编译开始`)
	if (err) {
		print.error(`${getTime()} client 静态资源服务器启动异常：${err.message}`)
	} else {
		print.info(`${getTime()} client 静态资源服务器启动成功`)
	}
})

const serverCompiler = webpack(serverConfig)

const app = new Koa()

const router = new Router()
// 强制 https
if (serverPort === 443) {
	app.use(enforceHttps({ redirectMethods: ['GET', 'HEAD', '', undefined] }))
}
// 启用协商缓存
app.use(conditional())
// 项目静态资源服务器
app.use(staticServer.projectStatic)
// 公共资源服务器
app.use(staticServer.commonStatic)
// 处理post参数
app.use(bodyParser())
// 合并请求参数
app.use(async (ctx, next) => {
	Object.assign(ctx.query, ctx.request.body)
	await next()
})
// 文章内容解析服务
app.use(actionAPI)
// 启动路由
app.use(router.routes())
// 重定向路由
app.use(redirect)

if (env === RUN_ENV.DEV) {
	serverCompiler.hooks.done.tap('afterCompile', stats => {
		print.info(`${getTime()} server 文件编译完成，耗时: ${stats.endTime - stats.startTime}ms`)
		httpServer.close(() => {
			httpServer.listen(serverPort, () => {
				print.info(`${getTime()} server 监听重启成功！`)
			})
		})
	})

	const proxy = createProxyMiddleware({
		target: 'http://localhost:3000',
		changeOrigin : true ,
		pathFilter: '/clientpublic',
		pathRewrite: { '^/clientpublic': '' },
	})
	// 将所有请求代理到 Webpack 开发服务器
	app.use(c2k(proxy))
	// 使用 webpack-dev-middleware 中间件
	app.use(
		devMiddleware.koaWrapper(serverCompiler, {
			publicPath: serverConfig.output.publicPath,
			stats: 'errors-only', // 设置 stats 选项
			// writeToDisk: true, // 将文件写入磁盘
			serverSideRender: true, // 指示模块启用服务器端渲染模式
		}),
	)

	// 使用 webpack-hot-middleware 中间件
	app.use(c2k(webpackHotMiddleware(serverCompiler)))
}

// 服务端渲染 ssr
app.use(pageSSR(env === RUN_ENV.DEV ? serverCompiler.outputFileSystem : undefined))

// 启动监听端口
if (serverPort === 443) {
	// ssl 文件
	const options = {
		key: fs.readFileSync('./server/config/ssl/www.qqweb.top.key'),
		cert: fs.readFileSync('./server/config/ssl/www.qqweb.top.pem'),
	}
	https.createServer(options, app.callback()).listen(serverPort)
	httpServer = http.createServer(app.callback()).listen(80)
} else {
	httpServer = http.createServer(app.callback()).listen(serverPort)
}
