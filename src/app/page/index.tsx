import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
import indexStore from '../store/index'
import '../style/index.less'

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
	const ssrInit = indexStore.getState().ssrInit
	await ssrInit(ctx);
}

Index.sslState = () => {
	const state = indexStore()
	return state
}

export default Index
