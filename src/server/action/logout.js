const userList = require('../config/user')

// 文章读取服务
function logout(ctx) {
	const result = {
		code: 200,
		data: { status: false, name: '' },
		msg: '退出登录失败',
	}

	try {
		const token = ctx.cookies.get('token')
		if (token) {
			const userInfo = userList.find(item => item.hash === token)
			// 置空登录态
			const options = {
				domain: ctx.request.hostname,
				path: '/',
				maxAge: -1000 * 60 * 60 * 24 * 30,
			}
			ctx.cookies.set('token', '', options)
			result.data.status = true
			result.data.name = ''
			if (userInfo) {
				userInfo.hash = ''
				result.msg = '退出登录成功！'
			} else {
				result.msg = '退出登录成功，当前登录态已失效'
			}
		} else {
			result.msg = '退出登录失败，用户未登录'
		}
	} catch (err) {
		result.code = 500
		result.msg = err.toString()
	}
	ctx.body = result
}

module.exports = logout
