import { ReactElement } from 'react'
import './index.less'

export default function Foot(): ReactElement {
	return (
		<div>
			<footer className="footer">
				<a
					className="link"
					rel="noopener noreferrer"
					target="_blank"
					href="https://github.com/xmyxm/react-isomorphism"
				>
					github link
				</a>
			</footer>
		</div>
	)
}
