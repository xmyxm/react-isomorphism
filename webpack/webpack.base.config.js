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
		// 指定了输出资源的公共 URL 地址的前缀，它会影响到所有通过 Webpack 加载的资源（如 JS、CSS、图片和字体文件）
		publicPath: '/assets',
		filename: 'js/[name].[contenthash].js',
	},
	cache: true,
	devtool: 'source-map',
	target: 'web',
	optimization: {
		chunkIds: 'deterministic',
		splitChunks: {
			chunks: 'all', // 对同步和异步 chunks 进行优化
			minSize: 0, // 生成 chunk 的最小体积（以 bytes 为单位）
			maxSize: 20000, // 0 表示没有限制
			minChunks: 1, // 分割前必须共享模块的最小 chunks 数
			maxAsyncRequests: 30, // 按需加载时的最大并行请求数
			maxInitialRequests: 30, // 入口点的最大并行请求数
			automaticNameDelimiter: '~', // 默认的 webpack chunk 名称连接符
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/, // 检测 node_modules 目录
					priority: -10, // 优先级
					reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中分离的模块，则将重用它而不是生成新的 chunk
					name(module, chunks, cacheGroupKey) {
						// 获取模块名称
						const moduleName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
						// 用模块名和 cacheGroupKey 创建 chunk 名称
						return `${cacheGroupKey}.${moduleName.replace('@', '')}`
					},
				},
				otherVendors: {
					minChunks: 2, // 覆盖外部配置的 minChunks
					priority: -20,
					reuseExistingChunk: true,
					name: 'otherVendors',
				},
				// 你可以在这里添加更多的配置来处理特定的公共模块
			},
		},
		runtimeChunk: {
			name: entrypoint => `runtime~${entrypoint.name}`, // 为每个入口生成一个运行时文件
		},
	},
	module: {
		rules: [
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
							name: 'font/[name].[ext]',
							limit: 1000,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		// 别名设置,主要是为了配和webpack.ProvidePlugin设置全局插件;
		alias: {
			// 绝对路径;特别注意这里定义的路径和依赖的包名不能重名
			'@component': path.resolve(__dirname, '../src/app/component'),
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
			chunks: ['index'], // 指定当前模板需要打入哪些js模块
			favicon: path.resolve('./src/favicon/favicon-32x32.png'),
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
			chunks: ['note'], // 指定当前模板需要打入哪些js模块
			favicon: path.resolve('./src/favicon/favicon-32x32.png'),
			scriptLoading: 'defer', // 支持非阻塞 javascript 加载 ( 'defer') 以提高页面启动性能
			minify: {
				// 启用代码压缩
				removeComments: false, // 移除注释
				collapseWhitespace: false, // 移除空格
			},
		}),
	],
}
