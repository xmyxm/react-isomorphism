import React from 'react'
import Head from '../component/head'
import Foot from '../component/foot'
import '../style/index.less'

export function Index() {
	return (
		<React.Fragment>
			<Head title="同构模板首页" />
			<Foot />
		</React.Fragment>
	)
}

export default { Index }
