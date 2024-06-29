import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
import { createStore } from '../store/index'
import '../style/index.less'

const initialState = typeof window === 'object' ? (window as any).__INITIAL_STATE__ : {}

const store = createStore(initialState)
export function Index() {
	return (
		<div>
			<Head title="React SSR Little" />
			<Main name="Index" to="note" />
			<Foot />
		</div>
	)
}

Index.sslLoad = async ctx => {
	console.log('------------- index ssr request')
	await store.dispatch.weather.getWeatherInfo(ctx)
}

Index.sslState = (): any => {
	const state = store.getState()
	return state
}

export default Index
