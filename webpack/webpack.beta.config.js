const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const config = require('./webpack.base.config.js')
config.mode = 'development'
config.devtool = 'source-map'

config.module.rules.push(
	{
		test: /\.(es6|jsx|js|ts|tsx)$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env', // 用于将现代 JavaScript 转换为兼容旧版环境的代码
						[
							"@babel/preset-react",
							{
							  "runtime": "automatic" // 对于 React 17 或更高版本
							}
						],
						'@babel/preset-typescript', // 用于处理 TypeScript
					],
					plugins: [
						// 这里可以添加 Babel 插件，例如：
						'@babel/plugin-proposal-class-properties', // 用于支持类属性语法
						'@babel/plugin-transform-runtime', // 避免重复引入辅助代码
						require.resolve('react-refresh/babel')
					]
				},
			},
			{
				loader: 'ts-loader',
				options: {
					// 关闭类型检查，即只进行转译
					// 类型检查交给 fork-ts-checker-webpack-plugin 在别的的线程中做
					transpileOnly: true,
					happyPackMode: true,
					configFile: './tsconfig/tsconfig.client.json', // 使用客户端的 tsconfig
				},
			},
		],
	},
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
	allowedHosts: 'all', //允许将访问开发服务器的服务列入白名单
	static: {
		// 指向包含静态文件的目录
		directory: config.output.path,
		// 启用文件目录列表
		serveIndex: true,
		publicPath: config.output.publicPath,
	},
	client: {
		progress: true, // 在浏览器中以百分比显示编译进度
		reconnect: true, // 告诉 dev-server 它应该尝试重新连接客户端的次数。当为 true 时，它将无限次尝试重新连接。
		logging: 'info', // 浏览器中设置日志级别
		overlay: {
			errors: true, // 当出现编译错误或警告时，在浏览器中显示
			warnings: true,
		},
	},
	compress: true, // 启用gzip 压缩：
	hot: true, // 启用 webpack 的 模块热替换 特性：
	host: 'localhost', //指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定为ip
	port: 3000, // 如果是小于1000的端口号，是需要sudo权限的，启用方式 sudo node server.js即可(可使用默认80端口)
	historyApiFallback: true, // 如果在服务器上找不到请求的资源,那么服务器将返回指定的 index.html 页面,从而允许应用程序使用基于 HTML5 History API 的路由。这种情况通常发生在使用了 HTML5 History API 的单页应用程序中
}

config.plugins.push(
	// @pmmmwh/react-refresh-webpack-plugin 是一个用于 Webpack 的插件，它结合 React 官方的 Fast Refresh（快速刷新）功能，提供了一种在开发过程中无需完全刷新页面就能更新 React 组件的能力。这个功能通常被称为热替换（Hot Module Replacement，HMR），但它专门为 React 组件定制，以保持组件状态并提供更好的开发体验。
	// Fast Refresh 是 React Native 引入的一个特性，后来被移植到了 React。与传统的 HMR 相比，Fast Refresh 能够更智能地处理 React 函数组件的更新，避免不必要的重新挂载，从而保留组件状态和 React hooks 的状态。
	new ReactRefreshWebpackPlugin(),
)

module.exports = config
