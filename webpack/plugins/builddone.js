const print = require('../../src/server/util/print-log')
class BuildDonePlugin {
	constructor(options) {
		this.options = { ...options }
	}

	apply(compiler) {
		// 在编译开始时记录开始时间
		compiler.hooks.beforeRun.tap('BuildDonePlugin', () => {
			this.startTime = Date.now()
			console.log(`================== this.startTime1: ${this.startTime}`)
		})

		// 在编译完成时计算耗时
		compiler.hooks.done.tapAsync('BuildDonePlugin', (compilation, callback) => {
			const duration = Date.now() - this.startTime
			console.log(`================== this.startTime2: ${this.startTime}`)
			print.info(`---- 构建完成，总耗时：${(duration / 1000).toFixed(1)}s ----`)
			// 必须执行此回调，否则会一直等待
			callback()
		})
	}
}

module.exports = BuildDonePlugin
