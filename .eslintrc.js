module.exports = {
	// 此项是用来告诉eslint找当前配置文件不能往父级查找
	root: true,
	// 脚本运行环境
	env: {
		browser: true,
		node: true, // webpack所以需要node一些环境变量
		es6: true,
	},
	// 额外的全局变量
	globals: {
		react: true,
		window: true,
		history: true,
		location: true,
		fetch: true,
	},
	// 所有的规则默认都是禁用的。在配置文件中，使用 "extends": "eslint:recommended" 来启用推荐的规则，报告一些常见的问题
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended', // 这是一个ESLint插件，包含了各类定义好的检测Typescript代码的规范
		'plugin:react/recommended',
		'plugin:prettier/recommended', // 启用eslint-plugin-prettier和eslint-config-prettier。且设置了"prettier/prettier"规则为"error"
	],
	// ESLint 默认使用Espree作为其解析器，@typescript-eslint/parser作为ESLint的解析器，用于解析typescript，从而检查和规范Typescript代码
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2019, // 指定你想要使用的 ECMAScript 版本 (2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）)
		sourceType: 'module', // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
		ecmaFeatures: {
			// 表示你想使用的额外的语言特性
			jsx: true, // 注意，对 JSX 语法的支持不用于对 React 的支持。React 使用了一些特定的 ESLint 无法识别的 JSX 语法。如果你正在使用 React 并且想要 React 语义支持，我们推荐你使用 eslint-plugin-react
			experimentalObjectRestSpread: true, // 启用实验性的 object rest/spread properties 支持
		},
	},
	// 通常输出规则。一些插件也可以输出一个或多个命名的配置。ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。插件名称可以省略 eslint-plugin- 前缀
	plugins: [
		'@typescript-eslint',
		'react',
		'html',
		'markdown', // eslint-plugin-markdown 可以检查 Markdown、 HTML以及其它语言文件中的代码
	],
	// 开启规则和发生错误时报告的等级
	rules: {
		'no-use-before-define': 'off',
		'no-plusplus': 'off',
		'no-alert': 'off',
		'class-methods-use-this': 'off',
		'no-restricted-globals': 'off',
		'no-console': 'off',
		'object-curly-newline': 'off',
		'import/no-unresolved': 'off',
		'no-multi-assign': 'off', // 链接变量的赋值可能会导致意外的结果并难以阅读 https://cloud.tencent.com/developer/section/1135717
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'import/extensions': 'off',
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'prettier/prettier': [
			// 配置 Prettier 规则
			'error',
			// 针对会被 ESLint 格式化的文件类型，Prettier 会作为 ESLint 的一个规则运行并格式化文件，因此需要添加如下配置
			{
				// 排版宽度即每行最大宽度。默认值是 80
				printWidth: 120,
				// 去掉代码结尾的分号
				semi: true,
				// 使用带引号替代双引号
				singleQuote: true,
				// 为多行数组的非末尾行添加逗号
				trailingComma: 'all',
				// 在对象字面量和括号之间添加空格
				bracketSpacing: true,
				// 箭头函数圆括号，"avoid" - 在可以消除的情况下，消除括号；"always" - 一直保留括号
				arrowParens: 'avoid',
				// Prettier 支持在一个文件的头部设置约束，仅格式化那些包含「特殊注释」的文件，这种约束称为「 pragma 编译附注」，/** @format */
				insertPragma: false,
				// 制表符宽度，每个层级缩进几个空格。默认值 2
				tabWidth: 4,
				// 是否使用 tab 代替 space(空格) 为单位缩进，默认 false
				useTabs: true,
			},
		],
	},
	settings: {
		// 自动发现React的版本，从而进行规范react代码
		react: {
			pragma: 'React',
			version: 'detect',
		},
	},
};
