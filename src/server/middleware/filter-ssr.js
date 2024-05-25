const indexPage = require('../action/page/index')
const notePage = require('../action/page/note')

// 页面优先走ssl逻辑
async function pageSSR(ctx, next) {
	const urlPath = ctx.path
	if (['', '/', '/index'].indexOf(urlPath) > -1) {
		indexPage(ctx)
	} else if (['/note'].indexOf(urlPath) > -1) {
		await notePage(ctx)
	} else {
		next()
	}
}

module.exports = pageSSR
