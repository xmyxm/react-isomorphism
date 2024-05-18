const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./webpack.base.config.js');

config.mode = 'development';
config.devtool = 'eval-cheap-module-source-map';
config.module.rules.push(
	{
		test: /\.(less|css)$/,
		use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
	},
	{
		test: /\.(jpe?g|png|gif|svg|ico)$/i,
		use: [
			{
				loader: 'url-loader',
				options: {
					name: 'img/[name].[ext]',
					limit: 1000,
				},
			},
		],
	},
);
config.devServer = {
	headers: {
		'Access-Control-Allow-Origin': '*', //支持服务跨域
	},
	compress: true, //一切服务都启用gzip 压缩：
	hot: true, //启用 webpack 的模块热替换特性
	host: 'localhost', //指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定为ip
	port: 3000, // 如果是小于1000的端口号，是需要sudo权限的，启用方式 sudo node server.js即可(可使用默认80端口)
	historyApiFallback: {
		// 如果在服务器上找不到请求的资源,那么服务器将返回指定的 index.html 页面,从而允许应用程序使用基于 HTML5 History API 的路由。这种情况通常发生在使用了 HTML5 History API 的单页应用程序中
		index: '/public/index.html'
	}
};

// 体积分析插件
config.plugins.push(new BundleAnalyzerPlugin({
	openAnalyzer: false // 是否自动打开报告页面，默认为 true
}));
// webpack 热替换插件(devServer中hot设置为true后必须添加此插件热替换才会生效)
config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;
