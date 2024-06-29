import { createModel } from '@rematch/core'
import tripService from '../../service/trip'
import type { IndexModel } from './modelType'

export const tripMenu = createModel<IndexModel>()({
	state: {
		tripMenuList: null,
	},
	reducers: {
		SET_MENU_LIST: (state, players) => {
			return {
				...state,
				tripMenuList: players,
			}
		},
	},
	effects: dispatch => {
		return {
			async getTripMenuList(ctx): Promise<any> {
				const menuList = await tripService.getTripMenuList(null, ctx)
				dispatch.tripMenu.SET_MENU_LIST(menuList)
			},
		}
	},
})
