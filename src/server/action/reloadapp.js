// 自动打包重启
const { execSync } = require('child_process')
const getTime = require('../util/util')
const print = require('../util/print-log')

// 自动编译重启
function reloadApp(ctx) {
	const password = ctx.headers['x-gitee-token'] || ctx.query.key
	const status = password === '123456aa'

	ctx.body = {
		code: 200,
		data: status,
		msg: status ? '验证通过，开始执行···' : '验证失败！',
	}

	if (status) {
		setTimeout(() => {
			print.info(`${getTime()} 身份校验成功`)
			print.info(`${getTime()} 清理本地改动`)
			execSync('git checkout .')
			print.info(`${getTime()} 拉取最新代码`)
			execSync('git pull')
			print.info(`${getTime()} 安装最新依赖`)
			execSync('npm i')
			print.info(`${getTime()} 开始打包`)
			execSync('npm run build')
			print.info(`${getTime()} 开始更新 robots.txt`)
			execSync('npm run update')
			print.info(`${getTime()} 开始重启`)
			execSync('pm2 reload all')
			print.info(`${getTime()} 重启完毕`)
		}, 100)
	} else {
		print.error(`${getTime()} 身份校验失败`)
	}
}

module.exports = reloadApp
