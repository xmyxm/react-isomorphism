const SparkMD5 = require('spark-md5')
const userList = require('../../config/user')

// 文章读取服务
function login(ctx) {
	const { name = '', pwd = '' } = ctx.query

	const result = {
		code: 200,
		data: { status: false, name: '' },
		msg: '登录失败',
	}

	try {
		const userInfo = userList.find(item => item.name === name)
		if (userInfo) {
			const courentPWD = userInfo.pw + new Date().getHours()
			if (courentPWD === pwd) {
				const hash = SparkMD5.hash(userInfo.name + Date.now())
				userInfo.hash = hash
				const options = {
					domain: ctx.request.hostname,
					path: '/',
					maxAge: 1000 * 60 * 60 * 24 * 30,
				}
				ctx.cookies.set('token', hash, options)
				result.data.status = true
				result.data.name = name
				result.msg = '登录成功'
			} else {
				result.msg = '密码错误，请重试'
			}
		} else {
			result.msg = '用户不存在'
		}
	} catch (err) {
		result.code = 500
		result.msg = err.toString()
	}
	ctx.body = result
}

module.exports = login
