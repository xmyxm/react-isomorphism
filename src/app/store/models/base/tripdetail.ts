import { createModel } from '@rematch/core'
import tripService from '../../service/trip'
import { TripDetailStateType } from './type/tripdetaillistType'
import type { NoteModel } from './modelType'

export const tripDetail = createModel<NoteModel>()({
	state: {
		tripDetailInfo: null,
	} as TripDetailStateType,
	reducers: {
		SET_DETAIL_LIST: (state, players) => {
			return {
				...state,
				tripDetailInfo: players,
			}
		},
	},
	effects: dispatch => {
		return {
			async getTripDetailList(ctx): Promise<any> {
				let params = {}
				if (ctx && ctx.query) {
					params = ctx.query
				}
				const detailInfo = await tripService.getTripDetailList(params, ctx)
				dispatch.tripDetail.SET_DETAIL_LIST(detailInfo)
			},
		}
	},
})
