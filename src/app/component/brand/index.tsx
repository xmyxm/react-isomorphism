import { ReactElement } from 'react'
import './index.less'

export interface Props {
	name?: string
	to?: string
}

export default function Brand(props: Props): ReactElement {
	const { name = 'Index', to = 'note' } = props

	return (
		<div className="brand">
			<div className="content">
				<div className="logo"></div>
				<div className="info">
					<div className="msg"> Page {name} </div>
					<a className="link" href={`/${to}`}>
						go to {to}
					</a>
				</div>
			</div>
		</div>
	)
}