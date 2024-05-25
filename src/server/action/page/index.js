const fs = require('fs')
const cheerio = require('cheerio')

module.exports = function index(ctx) {
	// const {
	// 	devMiddleware: { outputFileSystem, stats },
	// } = ctx.res.locals.webpack;
	// const jsonWebpackStats = stats.toJson();
	// const { assetsByChunkName, outputPath } = jsonWebpackStats;
	// ctx.body = {
	// 	outputFileSystem,
	// 	assetsByChunkName,
	// 	outputPath,
	// };

	// eslint-disable-next-line global-require
	const contentHtml = require('../../../../dist/server/index.js').default()
	const filePath = './dist/client/index.html'
	if (fs.existsSync(filePath)) {
		const pageHtml = fs.readFileSync(filePath, 'utf-8')
		const $ = cheerio.load(pageHtml)
		$('#main').html(contentHtml)
		const allContent = $.html()
		ctx.body = allContent
	}
}
