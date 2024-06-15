const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/client/page/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	devtool: 'source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								["@babel/preset-env", {
									"targets": {
									  "browsers": ["last 2 versions", "safari >= 7"]
									},
									modules: "umd",
									"useBuiltIns": "usage",
									"corejs": 3,
									"debug": true
								  }], // 用于将现代 JavaScript 转换为兼容旧版环境的代码
								[
									'@babel/preset-react',
									{
										runtime: 'automatic', // 对于 React 17 或更高版本
									},
								],
								'@babel/preset-typescript', // 用于处理 TypeScript
							],
							plugins: [
								// 这里可以添加 Babel 插件，例如：
								'@babel/plugin-proposal-class-properties', // 用于支持类属性语法
								'@babel/plugin-transform-runtime', // 避免重复引入辅助代码
							],
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
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/,
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
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, '../dist'),
		},
		compress: true,
		port: 3000,
	},
}
