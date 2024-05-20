const fs = require('fs');
const Koa = require('koa');
const http = require('http');
const https = require('https');
const webpack = require('webpack');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const proxy = require('http-proxy-middleware');
const conditional = require('koa-conditional-get');
const WebpackDevServer = require('webpack-dev-server');
const { default: enforceHttps } = require('koa-sslify');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const serverConfig = require('../webpack/webpack.server.config');
const staticServer = require('./server/middleware/filter-static');
const redirect = require('./server/middleware/filter-redirect');
const betaConfig = require('../webpack/webpack.beta.config');
const pageSSR = require('./server/middleware/filter-ssr');
const actionAPI = require('./server/action/index');
const print = require('./server/util/print-log');
const RUN_ENV = require('./server/util/run-env');
const getTime = require('./server/util/util');

const { argv } = process;
// 申明 Node 端口
let serverPort = 443;
// 环境判断
let env = RUN_ENV.PRO;

if (argv.length === 3 && argv[2] === 'dev') {
	serverPort = 8080;
	env = RUN_ENV.DEV;
}

const clientCompiler = webpack(betaConfig);
const server = new WebpackDevServer(betaConfig.devServer, clientCompiler);
server.startCallback(err => {
	print.info(`${getTime()} 编译开始`);
	if (err) {
		print.err(`${getTime()} 静态资源服务器启动异常：${err.message}`);
	} else {
		print.info(`${getTime()} 静态资源服务器启动成功`);
	}
});

const serverCompiler = webpack(serverConfig);

const app = new Koa();
const router = new Router();
// 强制 https
if (serverPort === 443) {
	app.use(enforceHttps({ redirectMethods: ['GET', 'HEAD', '', undefined] }));
}
// 启用协商缓存
app.use(conditional());
// 项目静态资源服务器
app.use(staticServer.projectStatic);
// 公共资源服务器
app.use(staticServer.commonStatic);
if (env === RUN_ENV.BETA) {
	// 将所有请求代理到 Webpack 开发服务器
	app.use(
		proxy('/servepublic', {
			target: 'http://localhost:3000',
			pathRewrite: { '^/servepublic': '' },
		}),
	);
	// 使用 webpack-dev-middleware 中间件
	app.use(
		devMiddleware(serverCompiler, {
			publicPath: serverConfig.output.publicPath,
		}),
	);

	// 使用 webpack-hot-middleware 中间件
	app.use(hotMiddleware(serverCompiler));

	// 监听 server 文件变化并自动重启服务器
	serverCompiler.watch({}, err => {
		if (err) {
			print.err(`${getTime()} server 文件编译出错：${err.message}`);
		} else {
			print.info(`${getTime()} server 文件编译出错：${err.message}`);
		}
	});
}
// 处理post参数
app.use(bodyParser());
// 合并请求参数
app.use(async (ctx, next) => {
	Object.assign(ctx.query, ctx.request.body);
	await next();
});
// 服务端渲染 ssr
app.use(pageSSR);
// 文章内容解析服务
app.use(actionAPI);
// 启动路由
app.use(router.routes());
// 重定向路由
app.use(redirect);
// 启动监听端口
if (serverPort === 443) {
	// ssl 文件
	const options = {
		key: fs.readFileSync('./server/config/ssl/www.qqweb.top.key'),
		cert: fs.readFileSync('./server/config/ssl/www.qqweb.top.pem'),
	};
	https.createServer(options, app.callback()).listen(serverPort);
	http.createServer(app.callback()).listen(80);
} else {
	http.createServer(app.callback()).listen(serverPort);
}
