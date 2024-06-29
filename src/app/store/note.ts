import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { NoteModel } from './models/base/modelType'
import { models } from './models/note'

type FullModel = ExtraModelsFromLoading<NoteModel> & ExtraModelsFromUpdated<NoteModel>

export function createStore(initialState) {
	return init<NoteModel, FullModel>({
		models,
		redux: {
			initialState,
		},
		plugins: [
			updated(),
			loading(),
			immerPlugin({
				whitelist: ['settings'],
			}),
			selectPlugin(),
		],
	})
}

export type Dispatch = RematchDispatch<NoteModel>
export type RootState = RematchRootState<NoteModel, FullModel>
