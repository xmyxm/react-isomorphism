// 未命中路由重定向
async function redirect(ctx, next) {
	try {
		// 执行后代的代码
		await next();
		if (!ctx.body && !ctx.req.complete) {
			// 没有资源
			ctx.status = 302;
			ctx.redirect('/index.html');
		}
	} catch (e) {
		// 如果后面的代码报错 返回500
		ctx.body = '500';
	}
}

module.exports = redirect;
