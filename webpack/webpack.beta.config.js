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
	contentBase: config.output.path,
	watchContentBase: true, //告诉服务器监视那些通过 devServer.contentBase 选项提供的文件。文件改动将触发整个页面重新加载。默认被禁用。
	compress: true, //一切服务都启用gzip 压缩：
	inline: true, //应用程序启用内联模式,默认内联模式,当源文件改变时会自动刷新页面
	hot: true, //启用 webpack 的模块热替换特性
	host: 'localhost', //指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定为ip
	stats: { colors: true }, // 用颜色标识
	port: 3000, // 如果是小于1000的端口号，是需要sudo权限的，启用方式 sudo node server.js即可(可使用默认80端口)
};

// 体积分析插件
config.plugins.push(new BundleAnalyzerPlugin());
// webpack 热替换插件(devServer中hot设置为true后必须添加此插件热替换才会生效)
config.plugins.push(new webpack.HotModuleReplacementPlugin());
// 注入Node环境变量
config.plugins.push(
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('development'),
	}),
);

module.exports = config;
