import React, { ReactElement } from 'react'
import './index.less'

export default function Foot(): ReactElement {
	return (
		<div>
			<footer className="footer">
				<a className="link" rel="noopener noreferrer" target="_blank" href="https://beian.miit.gov.cn">
					鄂ICP备2021011552号
				</a>
			</footer>
		</div>
	)
}
