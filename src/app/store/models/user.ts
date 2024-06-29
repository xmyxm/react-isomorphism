import { createModel } from '@rematch/core'
import type { NoteRootModel } from './note'

export const user = createModel<NoteRootModel>()({
	state: {
		userinfo: null,
	},
	reducers: {
		USER_SET_THEME: (state, payload) => {
			return {
				...state,
				userinfo: payload || null,
			}
		},
	},
	effects: dispatch => {
		const { user } = dispatch
		return {
			async getUserInfo(ctx): Promise<any> {
				const userInfo = { name: 'test', testurl: ctx.url }
				user.USER_SET_THEME(userInfo)
			},
		}
	},
})
