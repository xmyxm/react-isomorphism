import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
import { createStore } from '../store/index'
import '../style/index.less'

const initialState = typeof window === 'object' ? window.__INITIAL_STATE__ : {} // eslint-disable-line

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
	console.log('------------------------ sslLoad')
	await store.dispatch.weather.getWeatherInfo(ctx)
}

Index.sslState = () => {
	const state = store.getState()
	return state
}

export default Index
