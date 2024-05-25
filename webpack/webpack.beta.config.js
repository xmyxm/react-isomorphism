// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.base.config.js')

config.mode = 'development'
config.devtool = 'eval-cheap-module-source-map'
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
)
config.devServer = {
	headers: {
		'X-Custom-h': 'react', // 为所有响应添加 headers：
	},
	allowedHosts: 'all', //允许将允许访问开发服务器的服务列入白名单
	static: {
		directory: config.output.path,
		publicPath: '/clientpublic',
	},
	client: {
		progress: true, // 在浏览器中以百分比显示编译进度
		reconnect: true, // 告诉 dev-server 它应该尝试重新连接客户端的次数。当为 true 时，它将无限次尝试重新连接。
		logging: 'info', // 浏览器中设置日志级别
		overlay: {
			errors: true, // 当出现编译错误或警告时，在浏览器中显示
			warnings: true,
		},
		webSocketTransport: 'ws', // 客户端单独选择当前的 devServer 传输模式 'ws' | 'sockjs'
	},
	webSocketServer: 'ws',
	compress: true, // 启用gzip 压缩：
	hot: true, // 启用 webpack 的 模块热替换 特性：
	host: 'localhost', //指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定为ip
	port: 3000, // 如果是小于1000的端口号，是需要sudo权限的，启用方式 sudo node server.js即可(可使用默认80端口)
	historyApiFallback: true, // 如果在服务器上找不到请求的资源,那么服务器将返回指定的 index.html 页面,从而允许应用程序使用基于 HTML5 History API 的路由。这种情况通常发生在使用了 HTML5 History API 的单页应用程序中
}

// 体积分析插件
// config.plugins.push(
// 	new BundleAnalyzerPlugin({
// 		openAnalyzer: false, // 是否自动打开报告页面，默认为 true
// 	}),
// )

module.exports = config
