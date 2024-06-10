/* eslint-disable no-restricted-syntax */
const http = require('http')
const os = require('os')

function getLocalIpAddress() {
	const networkInterfaces = os.networkInterfaces()
	for (const interfaceName of Object.keys(networkInterfaces)) {
		for (const iface of networkInterfaces[interfaceName]) {
			// 跳过非 IPv4 和内部（如 127.0.0.1）地址
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address
			}
		}
	}
	return '127.0.0.1' // 如果没有找到，返回回环地址
}

const localIpAddress = getLocalIpAddress()
console.log('本机 IP 地址是:', localIpAddress)

// 定义请求的选项
let options = {
	port: 3000,
	host: '127.0.0.1:3000',
	hostname: '127.0.0.1',
	method: 'GET',
	headers: {
		cookie: '_lxsdk_cuid=18fbf2a2563c8-0d7101b127822e-296e4933-505c8-18fbf2a2563c8; _lxsdk=18fbf2a2563c8-0d7101b127822e-296e4933-505c8-18fbf2a2563c8',
		'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
		'accept-encoding': 'gzip, deflate, br, zstd',
		referer: 'http://localhost:8080/index',
		'sec-fetch-dest': 'style',
		'sec-fetch-mode': 'no-cors',
		'sec-fetch-site': 'same-origin',
		accept: 'text/css,*/*;q=0.1',
		'sec-ch-ua-platform': '"macOS"',
		'user-agent':
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
		'cache-control': 'no-cache',
		pragma: 'no-cache',
		connection: 'close',
		host: '127.0.0.1:3000',
	},
	agent: false,
	path: '/assets/css/index.4b1cf9ca67c6727030a2.css',
}

options = {
	port: 3000,
	host: '127.0.0.1:3000',
	hostname: '127.0.0.1',
	method: 'GET',
	headers: {
		cookie: '_lxsdk_cuid=18fbf2a2563c8-0d7101b127822e-296e4933-505c8-18fbf2a2563c8; _lxsdk=18fbf2a2563c8-0d7101b127822e-296e4933-505c8-18fbf2a2563c8',
		'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
		'accept-encoding': 'gzip, deflate, br, zstd',
		referer: 'http://localhost:8080/index',
		'sec-fetch-dest': 'style',
		'sec-fetch-mode': 'no-cors',
		'sec-fetch-site': 'same-origin',
		accept: 'text/css,*/*;q=0.1',
		'sec-ch-ua-platform': '"macOS"',
		'user-agent':
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
		'cache-control': 'no-cache',
		pragma: 'no-cache',
		connection: 'close',
		host: '127.0.0.1:3000',
	},
	agent: false,
	path: '/assets/css/index.4b1cf9ca67c6727030a2.css',
}

function sendRequest(data = {}) {
	const requestInfo = {
		...options,
		...data,
	}
	// 创建请求对象
	const req = http.request(requestInfo, res => {
		console.log(`状态码: ${res.statusCode}`) // 打印响应状态码
		console.log('响应头: ', res.headers) // 打印响应头

		// 接收响应体数据
		const rawData = []
		const contentType = res.headers['content-type']

		// 接收数据块并将其累积到 rawData 中
		res.on('data', chunk => {
			rawData.push(chunk)
		})

		// 响应体接收完毕
		res.on('end', () => {
			console.log('响应体数据接收完毕')
			try {
				const buffer = Buffer.concat(rawData)
				// 尝试根据 Content-Type 处理数据
				if (contentType.includes('application/json')) {
					// 处理 JSON 数据
					const parsedData = JSON.parse(buffer.toString())
					console.log(parsedData)
				} else if (contentType.includes('text/plain') || contentType.includes('text/html')) {
					// 处理文本数据
					console.log(buffer.toString())
				} else {
					// 如果是其他类型的数据，如二进制文件，转换 Buffer 为字符串，假设字符编码为 UTF-8
					const cssContent = buffer.toString('utf-8')
					console.log(cssContent) // 正确打印 CSS 文件的内容
				}
			} catch (e) {
				console.error(e.message) // 打印解析错误
			}
		})
	})

	// 监听请求错误事件
	req.on('error', e => {
		console.error(`请求遇到问题: ${e.message}`)
	})

	// 结束请求，如果是 POST 或 PUT 请求，可以在这之前写入请求体数据
	req.end()
}

module.exports = sendRequest
