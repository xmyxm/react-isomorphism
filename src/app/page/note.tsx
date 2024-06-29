import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
import { createStore } from '../store/note'
import '../style/note.less'

const initialState = typeof window === 'object' ? (window as any).__INITIAL_STATE__ : {}

const store = createStore(initialState)

export function Note() {
	return (
		<div>
			<Head title="React SSR Little" />
			<Main name="Note" to="index" />
			<Foot />
		</div>
	)
}

Note.sslLoad = async ctx => {
	console.log('------------- note ssr request')
	await store.dispatch.user.getUserInfo(ctx)
}

Note.sslState = (): any => {
	const state = store.getState()
	return state
}

export default Note
