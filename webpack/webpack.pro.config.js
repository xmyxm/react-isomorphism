const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //webpack插件，用于清除目录文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./webpack.base.config.js')

config.output.publicPath = '/'
config.mode = 'production'
config.devtool = 'nosources-source-map'
config.module.rules.push(
	{
		test: /\.(es6|jsx|js|ts|tsx)$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								targets: {
									browsers: ['last 2 versions', 'safari >= 7'],
								},
								modules: 'umd',
								useBuiltIns: 'usage',
								corejs: 3,
								debug: false,
							},
						], // 用于将现代 JavaScript 转换为兼容旧版环境的代码
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
		type: 'asset/resource',
		generator: {
			filename: 'img/[name].[hash:6][ext]',
		},
		parser: {
			dataUrlCondition: {
				maxSize: 100 * 1024,
			},
		},
	},
	{
		test: /\.(woff|woff2|eot|ttf|otf)$/i, // 匹配字体文件
		type: 'asset/resource', // 使用 asset/resource 模块
		generator: {
			filename: 'fonts/[name].[hash:6][ext][query]', // 输出文件名和路径
		},
	},
)
config.plugins.push(
	new CleanWebpackPlugin(), // 默认删除webpack output.path目录中的所有文件
	// css文件抽离设置
	new MiniCssExtractPlugin({
		filename: 'css/[name].[contenthash].css',
	}),
)

config.optimization = {
	minimize: true,
	minimizer: [new TerserPlugin()], // TerserPlugin 来压缩 JavaScript 代码
	splitChunks: {
		// 将代码分割成不同的包，以便更好地利用缓存和并行加载
		chunks: 'all',
		minSize: 20000,
		maxSize: 70000,
		minChunks: 1,
		maxAsyncRequests: 30,
		maxInitialRequests: 30,
		automaticNameDelimiter: '~',
		cacheGroups: {
			vendors: {
				test: /[\\/]node_modules[\\/]/,
				priority: -10,
			},
			default: {
				minChunks: 2,
				priority: -20,
				reuseExistingChunk: true,
			},
		},
	},
	runtimeChunk: 'single', // 将运行时代码拆分成单独的 chunk，以便更好地利用缓存
	usedExports: true, // 启用 Tree Shaking，删除未使用的代码
	concatenateModules: true, // 启用 Scope Hoisting，将所有模块放在一个闭包中，提高代码执行效率
	sideEffects: true, // 标记无副作用的模块，以便更好地进行 Tree Shaking
}

module.exports = config
