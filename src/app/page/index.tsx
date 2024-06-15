import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
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

export default Index
