import { createModel } from '@rematch/core'
import tripService from '../../service/trip'
import type { NoteModel } from './modelType'

export const tripDetail = createModel<NoteModel>()({
	state: {
		tripDetailList: null,
	},
	reducers: {
		SET_DETAIL_LIST: (state, players) => {
			return {
				...state,
				tripDetailList: players,
			}
		},
	},
	effects: dispatch => {
		return {
			async getTripDetailList(ctx): Promise<any> {
				const detailList = await tripService.getTripDetailList(null, ctx)
				dispatch.tripDetail.SET_DETAIL_LIST(detailList)
			},
		}
	},
})
