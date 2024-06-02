const getNote = require('./getNote')
const login = require('./login')
const logout = require('./logout')
const reloadApp = require('./reloadapp')

function action(ctx, next) {
	const { path } = ctx
	switch (path) {
		case '/api/getNote':
			getNote(ctx, next)
			break
		case '/api/login':
			login(ctx, next)
			break
		case '/api/logout':
			logout(ctx, next)
			break
		case '/api/reloadApp':
			reloadApp(ctx, next)
			break
		default:
			next()
			break
	}
}

module.exports = action
