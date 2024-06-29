import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import persist from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
// import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, NoteRootModel } from './models/note'

type FullModel = ExtraModelsFromLoading<NoteRootModel> & ExtraModelsFromUpdated<NoteRootModel>

export function createStore(initialState) {
	return init<NoteRootModel, FullModel>({
		models,
		redux: {
			initialState,
		},
		plugins: [
			updated(),
			loading(),
			persist({
				key: 'persist-storage',
				storage,
				whitelist: ['settings'],
			}),
			// immerPlugin({
			// 	whitelist: ['settings'],
			// }),
			selectPlugin(),
		],
	})
}

export type Dispatch = RematchDispatch<NoteRootModel>
export type RootState = RematchRootState<NoteRootModel, FullModel>
