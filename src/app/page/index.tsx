import { Provider } from 'react-redux'
import Weather from '../component/weather'
import TripMenu from '../component/tripmenu'
import { createStore } from '../store/index'
import Head from '../component/head'
import Foot from '../component/foot'
import '../style/index.less'

const initialState = typeof window === 'object' ? (window as any).__INITIAL_STATE__ : {}

const store = createStore(initialState)
export function Index() {
	return (
		<Provider store={store}>
			<Head title="武汉天气" />
			<Weather />
			<TripMenu />
			<Foot />
		</Provider>
	)
}

Index.sslLoad = async ctx => {
	console.log('------------- index sslLoad')
	await Promise.all([store.dispatch.weather.getWeatherInfo(ctx), store.dispatch.tripMenu.getTripMenuList(ctx)])
}

Index.sslState = (): any => {
	const state = store.getState()
	return state
}

export default Index
