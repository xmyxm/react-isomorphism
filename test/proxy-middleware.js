// eslint-disable-next-line import/no-extraneous-dependencies
const httpProxy = require('http-proxy')

// 创建一个代理服务器
const proxy = httpProxy.createProxyServer({})

// 监听 proxyReq 事件
proxy.on('proxyReq', (proxyReq, req, res) => {
	// 获取代理请求的完整 URL
	const fullUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
	console.log('Proxying request to1:', req, res)
	console.log('Proxying request to2:', fullUrl)
})

// 代理请求到目标服务器
// proxy.web(req, res, { target: 'http://example.com' })
