import Head from '../component/head'
import Main from '../component/main'
import Foot from '../component/foot'
import '../style/note.less'

export function Note() {
	return (
		<div>
			<Head title="React SSR Little" />
			<Main name="Note" to="index" />
			<Foot />
		</div>
	)
}

export default Note
