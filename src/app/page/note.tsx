import React from 'react'
import Head from '../component/head'
import Foot from '../component/foot'
import '../style/note.less'

export function Note() {
	return (
		<React.Fragment>
			<Head title="同构模板Note" />
			<Foot />
		</React.Fragment>
	)
}

export default { Note }
