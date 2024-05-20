const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const betaConfig = require('../webpack/webpack.beta.config');
const print = require('./server/util/print-log');
const getTime = require('./server/util/util');

const clientCompiler = webpack(betaConfig);

const server = new WebpackDevServer(betaConfig.devServer, clientCompiler);
server.startCallback(err => {
	print.info(`${getTime()} 编译完成`);
	if (err) {
		print.err(`${getTime()} 启动出错：${err.message}`);
	} else {
		print.info(`${getTime()} 静态资源服务器启动成功`);
		// open(`http://${betaConfig.devServer.host}:${serverPort}/index`);
	}
});
