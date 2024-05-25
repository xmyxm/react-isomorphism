const fs = require('fs')
const { JSDOM } = require('jsdom')

module.exports = async function index(ctx) {
	try {
		// eslint-disable-next-line global-require
		const { data, html } = await require('../../../../dist/server/note.js').default(ctx)
		const filePath = './dist/client/note.html'
		if (fs.existsSync(filePath)) {
			const pageHtml = fs.readFileSync(filePath, 'utf-8')
			const dom = new JSDOM(pageHtml)
			const { document } = dom.window
			const { title } = data
			document.title = title
			const metaKeyEle = document.head.querySelector("meta[name='keywords']")
			const metaDescriptionEle = document.head.querySelector("meta[name='description']")
			if (metaKeyEle && metaDescriptionEle) {
				metaDescriptionEle.content = metaKeyEle.content = title
			}
			const scriptDom = document.createElement('script')
			scriptDom.type = 'text/javascript'
			scriptDom.innerHTML = `window.ssr_data = ${JSON.stringify(data)}`
			document.body.appendChild(scriptDom)
			document.getElementById('main').innerHTML = html
			ctx.body = dom.serialize()
		}
	} catch (e) {
		console.error(e)
		ctx.body = '出错啦!'
	}
}
