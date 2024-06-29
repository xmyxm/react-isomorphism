import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { IndexModel } from './models/base/modelType'
import { models } from './models/index'

type FullModel = ExtraModelsFromLoading<IndexModel> & ExtraModelsFromUpdated<IndexModel>

export function createStore(initialState) {
	return init<IndexModel, FullModel>({
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

export type Dispatch = RematchDispatch<IndexModel>
export type RootState = RematchRootState<IndexModel, FullModel>
