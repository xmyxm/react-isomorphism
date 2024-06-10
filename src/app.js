const fs = require('fs')
const Koa = require('koa')
const http = require('http')
const https = require('https')
const webpack = require('webpack')
const c2k = require('koa-connect')
const { bodyParser } = require('@koa/bodyparser')
const conditional = require('koa-conditional-get')
const WebpackDevServer = require('webpack-dev-server')
const { default: enforceHttps } = require('koa-sslify')
const devMiddleware = require('webpack-dev-middleware')
const {
	createProxyMiddleware,
	debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
	loggerPlugin, // log proxy events to a logger (ie. console)
	errorResponsePlugin, // return 5xx response on proxy error
	proxyEventsPlugin,
} = require('http-proxy-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const serverConfig = require('../webpack/webpack.server.beta.config')
const staticServer = require('./server/middleware/filter-static')
const initRouter = require('./server/middleware/filter-router')
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

const app = new Koa()

// 强制 https
if (serverPort === 443) {
	app.use(enforceHttps({ redirectMethods: ['GET', 'HEAD', '', undefined] }))
}
// 启用协商缓存
app.use(conditional())
// 项目静态资源服务器
app.use(staticServer.projectStatic)
// // 公共资源服务器
app.use(staticServer.commonStatic)
// 处理post参数
app.use(bodyParser())
// 合并请求参数
app.use(async (ctx, next) => {
	Object.assign(ctx.query, ctx.request.body)
	await next()
})
// 文章内容解析服务
const router = initRouter()
// 将路由注册为中间件
app.use(router.routes())
// 用于根据 router.routes() 中定义的路由自动设置响应头部 Allow。如果收到了一个没有定义处理函数的请求方法（例如，对于一个只定义了 GET 处理函数的路由，收到了一个 POST 请求），这个中间件会返回 405 Method Not Allowed 或 501 Not Implemented。
// 此外，这个中间件也提供了对 OPTIONS 请求的响应，自动返回服务器所支持的方法。这对于 RESTful API 的开发尤其有用，因为客户端可以通过发送 OPTIONS 请求来了解服务器支持哪些 HTTP 方法
app.use(router.allowedMethods())

if (env === RUN_ENV.DEV) {
	const fsMap = {}
	const clientCompiler = webpack(betaConfig)
	// 监听 'compile' 事件，它在编译开始时触发
	clientCompiler.hooks.compile.tap('compile', () => {
		console.log(`${getTime()} client 开始编译`)
	})
	// 监听 'done' 事件，它在每次编译完成后触发
	clientCompiler.hooks.done.tap('afterCompile', stats => {
		fsMap.clientFS = clientCompiler.outputFileSystem
		print.info(`${getTime()} client 文件编译完成，耗时: ${stats.endTime - stats.startTime}ms`)
		if (!httpServer) {
			httpServer = http.createServer(app.callback()).listen(serverPort)
		}
	})
	const devServer = new WebpackDevServer(betaConfig.devServer, clientCompiler)
	devServer.startCallback(err => {
		print.info(`${getTime()} client 编译开始`)
		if (err) {
			print.error(`${getTime()} client 静态资源服务器启动异常：${err.message}`)
		} else {
			print.info(`${getTime()} client 静态资源服务器启动成功`)
		}
	})

	const serverCompiler = webpack(serverConfig)
	// 监听 'compile' 事件，它在编译开始时触发
	serverCompiler.hooks.compile.tap('compile', () => {
		console.log(`${getTime()} server 开始编译`)
	})
	serverCompiler.hooks.done.tap('afterCompile', stats => {
		fsMap.serverFS = serverCompiler.outputFileSystem
		print.info(`${getTime()} server 文件编译完成，耗时: ${stats.endTime - stats.startTime}ms`)
		// httpServer.close(() => {
		// 	httpServer.listen(serverPort, () => {
		// 		print.info(`${getTime()} server 监听重启成功！`)
		// 	})
		// })
	})

	const requestURLLogger = (proxyServer, options) => {
		proxyServer.on('proxyReq', (proxyReq, req, res) => {
			// require('../test/proxy.js')({ path: proxyReq.path})
			// console.log(`[HPM] [${req.method}] [${proxyReq.protocol}] [${proxyReq.host}] [${proxyReq.path}] 代理URL: ${req.url}`) // outputs: [HPM] GET /users
		})
	}
	const proxy = createProxyMiddleware({
		target: {
			protocol: 'http:',
			port: 3000,
			host: 'localhost:3000',
			hostname: `localhost`,
		},
		changeOrigin: true,
		pathFilter: '/assets',
		// pathRewrite: { '^/assets': '' },
		// 对预配置的插件不满意，您可以通过配置将其弹出ejectPlugins: true
		ejectPlugins: true,
		plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin, requestURLLogger],
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
	// 服务端渲染 ssr
	app.use(pageSSR(fsMap))
} else {
	// 服务端渲染 ssr
	app.use(pageSSR({ serverFS: fs, clientFS: fs }))
	// 启动监听端口
	if (serverPort === 443) {
		// ssl 文件
		const options = {
			key: fs.readFileSync('./server/config/ssl/www.qqweb.top.key'),
			cert: fs.readFileSync('./server/config/ssl/www.qqweb.top.pem'),
		}
		https.createServer(options, app.callback()).listen(serverPort)
		httpServer = http.createServer(app.callback()).listen(80)
	}
}
