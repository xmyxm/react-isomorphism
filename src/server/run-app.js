const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const open = require('open');
const { execSync } = require('child_process');
const config = require('../webpack/webpack.beta.config');
const print = require('./util/print-log');
const getTime = require('./util/util');

// 启动函数
async function run() {
	const { argv } = process;
	// 申明Node端口
	let serverPort = 0;
	print.info(`${getTime()} 打印执行参数：${argv};`);
	console.log(argv);
	if (argv.length === 3) {
		const { port, host } = config.devServer;

		if (argv[2] === 'dev-server') {
			// node接口启动的端口要避免和devServer的端口冲突
			serverPort = port + 1;
			// 增加代理配置
			Object.assign(config.devServer, {
				proxy: {
					'/api/*': {
						target: `http://${host}:${serverPort}`,
					},
				},
			});
			const compiler = webpack(config);
			const server = new WebpackDevServer(compiler, config.devServer);
			server.listen(port, host, err => {
				if (err) {
					print.err(`${getTime()} 启动出错：${err}`);
				} else {
					open(`http://${host}:${port}/index.html`);
				}
			});
			print.info(`${getTime()} Node运行端口：${port}; devServer运行端口：${serverPort}`);
		} else {
			// 模拟线上运行
			print.info(`${getTime()} 预发布环境开始打包`);
			execSync('npm run build');
			print.info(`${getTime()} 预发布环境打包完成`);
			serverPort = port;
		}
	} else {
		print.info(`${getTime()} 线上环境开始打包`);
		execSync('npm run build');
		print.info(`${getTime()} 线上环境打包完成`);
		serverPort = 443;
	}
	print.info(`${getTime()} 运行端口：${serverPort}`);
	return serverPort;
}

module.exports = run;
