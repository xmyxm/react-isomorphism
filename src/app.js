const fs = require('fs');
const http = require('http');
const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { default: enforceHttps } = require('koa-sslify');
const conditional = require('koa-conditional-get');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const open = require('open');
const betaConfig = require('../webpack/webpack.beta.config');
const proConfig = require('../webpack/webpack.pro.config');
const serverConfig = require('../webpack/webpack.server.config');
const print = require('./server/util/print-log');
const getTime = require('./server/util/util');
const RUN_ENV = require('./server/util/run-env')
const pageSSR = require('./server/middleware/filter-ssr');
const redirect = require('./server/middleware/filter-redirect');
const staticServer = require('./server/middleware/filter-static');
const actionAPI = require('./server/action/index');

// 启动函数
async function run() {
	const { argv } = process;
	// 申明 Node 端口
	let serverPort = 443;
    // 环境判断
    let env = RUN_ENV.PRO
	
	if (argv.length === 3 && argv[2] === 'dev') {
        serverPort = 8080
		env = RUN_ENV.DEV
	}
    
    print.info(`${getTime()} 打印环境参数：${env};`);

    const clientCompiler = webpack(env === RUN_ENV.PRO ? proConfig : betaConfig);
    const serverCompiler = webpack(serverConfig);

    if(env === RUN_ENV.DEV) {
        print.info(`${getTime()} ${env} 环境开始编译`);
        const server = new WebpackDevServer(betaConfig.devServer, clientCompiler);
        server.startCallback(err => {
            print.info(`${getTime()} ${env} 编译完成`);
            if (err) {
                print.err(`${getTime()} 启动出错：${err.message}`);
            } else {
                print.info(`${getTime()} ${env} 静态资源服务器启动成功`);
                open(`http://${betaConfig.devServer.host}:${serverPort}/index`);
            }
        });
    }

	return {
        clientCompiler,
        serverCompiler,
        serverPort,
        env
    };
}

// 调试启动
run().then(({ serverCompiler, serverPort, env }) => {
    return 
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
            proxy('/assets', {
                target: 'http://localhost:3000',
                pathRewrite: { '^/assets': '' },
            })
        );
        // 使用 webpack-dev-middleware 中间件
        app.use(
            require('webpack-dev-middleware')(serverCompiler, {
                publicPath: serverConfig.output.publicPath,
            })
        );
  
        // 使用 webpack-hot-middleware 中间件
        app.use(require('webpack-hot-middleware')(serverCompiler));

        // 监听 server 文件变化并自动重启服务器
        // compiler.watch({}, (err) => {
        //     if (err) {
        //         print.err(`${getTime()} server 文件编译出错：${err.message}`);
        //     } else {
        //         print.info(`${getTime()} server 文件编译出错：${err.message}`);
        //     }
        // });
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
});
