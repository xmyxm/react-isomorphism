const webpack = require('webpack')
const path = require('path')
const BuildDonePlugin = require('./plugins/builddone')
const packageFilePath = path.join(__dirname, '../dist/server')

module.exports = {
	entry: {
		index: [ './src/app/page/index.tsx' ],
		note: [ './src/app/page/note.tsx' ],
	},
	output: {
		clean: true,
		path: packageFilePath,
		filename: '[name].js',
		libraryTarget: 'commonjs2',
	},
	mode: 'development',
	cache: true,
	devtool: 'source-map',
	target: 'node',
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
							configFile: './tsconfig/tsconfig.server.json', // 使用客户端的 tsconfig
						},
					},
				],
			},
			{
				test: /\.woff|ttf|woff2|eot$/,
				use: {
					loader: 'ignore-loader',
				},
			},
			{
				test: /\.(less|css)$/,
				use: {
					loader: 'ignore-loader',
				},
			},
			{
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				use: {
					loader: 'ignore-loader',
				},
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
		// 当从 npm 包中导入模块时（例如，import * as D3 from 'd3'），此选项将决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同。
		mainFields: ['module', 'main'],
	},
	plugins: [
		new BuildDonePlugin({ text: '编译完成' }),
		//    new webpack.BannerPlugin('@web-little'),
	],
}
