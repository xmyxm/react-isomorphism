const fs = require('fs');
const cheerio = require('cheerio');
const indexPage = require('../../../dist/server/index.js');

module.exports = function index(ctx) {
	const contentHtml = indexPage.default();
	const filePath = './dist/client/index.html';
	if (fs.existsSync(filePath)) {
		const pageHtml = fs.readFileSync(filePath, 'utf-8');
		const $ = cheerio.load(pageHtml);
		$('#main').html(contentHtml);
		const allContent = $.html();
		ctx.body = allContent;
	}
};
