const getNote = require('./api/getNote');
const login = require('./api/login');
const logout = require('./api/logout');
const reloadApp = require('./api/reloadapp');

function action(ctx, next) {
	const { path } = ctx;
	switch (path) {
		case '/api/getNote':
			getNote(ctx, next);
			break;
		case '/api/login':
			login(ctx, next);
			break;
		case '/api/logout':
			logout(ctx, next);
			break;
		case '/api/reloadApp':
			reloadApp(ctx, next);
			break;
		default:
			break;
	}
}

module.exports = action;
