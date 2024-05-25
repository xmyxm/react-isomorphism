import React from 'react'
import Header from '../component/header'
import Footer from '../component/footer'
import '../style/index.less'

export function Index() {
	console.log('========1========')
	return (
		<React.Fragment>
			<Header title="同构模板首页" />
			<Footer />
		</React.Fragment>
	)
}

export default { Index }
