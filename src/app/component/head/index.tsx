import { useEffect, useState, useCallback, ReactElement } from 'react'
import Helmet from 'react-helmet'
import { getDateNowText } from '../../util/util'
import './index.less'

export interface Props {
	title?: string
}

export default function Head(props: Props): ReactElement {
	const { title = '书签' } = props
	const [dateText, setDateText] = useState(getDateNowText())

	useEffect(() => {
		setTimeout(() => {
			setDateText(getDateNowText())
		}, 1000)
	}, [dateText])

	return (
		<div>
			<Helmet>
				<title>welcome！</title>
				<meta name="keywords" content="同构SEO" />
			</Helmet>
			<header className="header">
				<div className='logo'></div>
				<div className="title">
					{title}
				</div>
				<div className="time">{dateText}</div>
			</header>
			<div className="headerbox"></div>
		</div>
	)
}
