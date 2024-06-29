import { createModel } from '@rematch/core'
import type { NoteRootModel } from './note'

export const review = createModel<NoteRootModel>()({
	state: {
		reviewList: [],
	},
	reducers: {
		SET_THEME: (state, payload) => {
			state.reviewList = payload
		},
	},
})
