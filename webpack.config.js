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
				use: 'ts-loader',
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
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 9000,
	},
}
