import { Provider } from 'react-redux'
import Head from '../component/head'
import Brand from '../component/brand'
import Foot from '../component/foot'
import { createStore } from '../store/note'
import '../style/note.less'

const initialState = typeof window === 'object' ? (window as any).__INITIAL_STATE__ : {}

const store = createStore(initialState)

export function Note() {
	return (
		<Provider store={store}>
			<Head title="React SSR Little" />
			<Brand name="Note" to="index" />
			<Foot />
		</Provider>
	)
}

Note.sslLoad = async ctx => {
	console.log('------------- index sslLoad')
	await store.dispatch.tripDetail.getTripDetailList(ctx)
}

Note.sslState = (): any => {
	const state = store.getState()
	return state
}

export default Note
