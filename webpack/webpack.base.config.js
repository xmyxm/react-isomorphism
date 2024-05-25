const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BuildDonePlugin = require('./plugins/builddone')
const packageFilePath = path.join(__dirname, '../dist/client')

module.exports = {
	entry: {
		index: ['./src/client/page/index.tsx'],
		note: ['./src/client/page/note.tsx'],
	},
	output: {
		clean: true,
		path: packageFilePath,
		filename: 'js/[name].[contenthash].js',
	},
	cache: true,
	devtool: 'source-map',
	target: 'web',
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 2,
				},
			},
		},
		runtimeChunk: {
			// manifest文件用来引导所有模块的交互。manifest文件包含了加载和处理模块的逻辑。
			// 当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。当模块被打包并运输到浏览器上时，
			name: 'manifest',
		},
	},
	module: {
		rules: [
			{
				test: /\.(es6|jsx|js|ts|tsx)$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					{
						loader: 'ts-loader',
						options: {
							// 关闭类型检查，即只进行转译
							// 类型检查交给 fork-ts-checker-webpack-plugin 在别的的线程中做
							transpileOnly: true,
							happyPackMode: true,
						},
					},
				],
			},
			{
				// html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					sources: true,
					minimize: true,
				},
			},
			{
				test: /\.woff|ttf|woff2|eot$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1000,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.jsx', '.tsx', '.js'],
		// 别名设置,主要是为了配和webpack.ProvidePlugin设置全局插件;
		alias: {
			// 绝对路径;特别注意这里定义的路径和依赖的包名不能重名
			'@component': path.resolve(__dirname, '../src/component'),
		},
	},
	plugins: [
		new BuildDonePlugin({ text: '编译完成' }),
		new webpack.BannerPlugin('@web-little'),
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
			filename: 'index.html', // 可以使用hash命名
			title: '书签',
			inject: 'body', // 脚本包含到body 也可以写到head里面
			chunks: ['manifest', 'commons', 'index'], // 指定当前模板需要打入哪些js模块
			favicon: path.resolve('./src/favicon/favicon.svg'),
			scriptLoading: 'defer', // 支持非阻塞 javascript 加载 ( 'defer') 以提高页面启动性能
			minify: {
				// 启用代码压缩
				removeComments: false, // 移除注释
				collapseWhitespace: false, // 移除空格
			},
		}),
		new HtmlWebpackPlugin({
			template: './src/html/note.html',
			filename: 'note.html', // 可以使用hash命名
			title: '文章',
			inject: 'body', // 脚本包含到body 也可以写到head里面
			chunks: ['manifest', 'commons', 'note'], // 指定当前模板需要打入哪些js模块
			favicon: path.resolve('./src/favicon/favicon.svg'),
			scriptLoading: 'defer', // 支持非阻塞 javascript 加载 ( 'defer') 以提高页面启动性能
			minify: {
				// 启用代码压缩
				removeComments: false, // 移除注释
				collapseWhitespace: false, // 移除空格
			},
		}),
	],
}
