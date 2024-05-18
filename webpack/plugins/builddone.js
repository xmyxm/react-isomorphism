const print = require('../../src/server/util/print-log')
class BuildDonePlugin {
  constructor(options) {
    this.options = { ...options};
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync('BuildDonePlugin', (compilation, callback) => {
      print.info('---- 构建完成 ----');
      // 必须执行此回调，否则会一直等待
      callback();
    });
  }
}

module.exports = BuildDonePlugin;
