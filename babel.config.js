module.exports = function (api) {
	api.cache(true)

	presets = [
		'@babel/preset-env', // 用于将现代 JavaScript 转换为兼容旧版环境的代码
		[
			"@babel/preset-react",
			{
			  "runtime": "automatic" // 对于 React 17 或更高版本
			}
		],
		'@babel/preset-typescript', // 用于处理 TypeScript
	]
    
    plugins = [
        // 这里可以添加 Babel 插件，例如：
        '@babel/plugin-proposal-class-properties', // 用于支持类属性语法
        '@babel/plugin-transform-runtime', // 避免重复引入辅助代码
    ]

	return {
		presets,
		plugins,
	}
}
