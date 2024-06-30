import { createModel } from '@rematch/core'
import tripService from '../../service/trip'
import { TripMenuStateType } from './type/tripmenuType'
import type { IndexModel } from './modelType'

export const tripMenu = createModel<IndexModel>()({
	state: {
		tripMenuInfo: null,
	} as TripMenuStateType,
	reducers: {
		SET_MENU_LIST: (state, players) => {
			return {
				...state,
				tripMenuInfo: players,
			}
		},
	},
	effects: dispatch => {
		return {
			async getTripMenuList(ctx): Promise<any> {
				const tripMenuInfo = await tripService.getTripMenuList(null, ctx)
				dispatch.tripMenu.SET_MENU_LIST(tripMenuInfo)
			},
		}
	},
})
