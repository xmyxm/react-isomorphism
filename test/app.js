const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../webpack/webpack.beta.config')

// 创建一个webpack编译器实例
const compiler = webpack(webpackConfig)

// 监听 'done' 事件，它在每次编译完成后触发
compiler.hooks.done.tap('done', stats => {
	console.log('============================== 编译完成 1')
	readWebpackFile('done')
})

compiler.hooks.done.tap('afterCompile', stats => {
	console.log('============================== 编译完成 2')
	readWebpackFile('afterCompile')
})

// 创建webpack-dev-server实例
const server = new WebpackDevServer(
	{
		// webpack-dev-server的配置选项
		// ...
	},
	compiler,
)

// 启动webpack-dev-server
server.startCallback(() => {
	console.log('webpack-dev-server started')
	readWebpackFile('startCallback')
})

function readWebpackFile(name = '') {
	// 递归函数来遍历内存文件系统
	function readDirectory(fs, directory) {
		let paths = []
		const items = fs.readdirSync(directory)

		items.forEach(item => {
			const currentPath = `${directory}/${item}`
			const isDirectory = fs.statSync(currentPath).isDirectory()

			if (isDirectory) {
				// 如果是目录，则递归读取
				paths = paths.concat(readDirectory(fs, currentPath))
			} else {
				// 如果是文件，则添加到路径列表
				paths.push(currentPath)
			}
		})

		return paths
	}

	// 访问webpack内存文件系统
	const outputFileSystem = compiler.outputFileSystem

	// 从根目录开始读取所有文件路径
	const allPaths = readDirectory(outputFileSystem, '/')

	// 输出所有文件路径
	console.log(`=====${name}===============打印文件`, allPaths)
}
