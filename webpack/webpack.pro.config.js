const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //webpack插件，用于清除目录文件
const config = require('./webpack.base.config.js')

config.mode = 'production'
config.devtool = 'nosources-source-map'
config.module.rules.push(
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
		test: /\.(less|css)$/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
				options: {},
			},
			'css-loader',
			'postcss-loader',
			'less-loader',
		],
	},
	{
		test: /\.(jpe?g|png|gif|svg|ico)$/i,
		use: [
			{
				// 既然base.config中配置了雪碧图，这里就无需使用 url-loader 的base64能力，直接使用 file-loader 即可，
				// 如果非常小的图片想用 url-loader 处理也可以
				loader: 'file-loader', //'file-loader',
				options: {
					name: 'img/[name].[contenthash].[ext]',
				},
			},
		],
	},
)
config.plugins.push(
	new CleanWebpackPlugin(), // 默认删除webpack output.path目录中的所有文件
	// css文件抽离设置
	new MiniCssExtractPlugin({
		filename: 'css/[name].[contenthash].css',
	}),
	// 体积分析插件
	new BundleAnalyzerPlugin(),
)

module.exports = config
