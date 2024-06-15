import Head from '../component/head'
import Foot from '../component/foot'
import '../style/index.less'

export function Index() {
	console.log(1001)
	return (
		<div>
			<Head title="同构首页模板" />
			<Foot />
		</div>
	)
}

export default Index
