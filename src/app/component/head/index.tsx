import React, { useEffect, useState, useCallback, ReactElement } from 'react'
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

	const goHome = useCallback(() => {
		window.location.href = location.origin
	}, [])

	return (
		<div>
			<Helmet>
				<title>欢迎！</title>
				<meta name="keywords" content="同构SEO" />
			</Helmet>
			<header className="header">
				<div onClick={goHome} className="title">
					<i className="logo-icon"></i>
					<span>{title}</span>
				</div>
				<div className="time">{dateText}</div>
			</header>
			<div className="headerbox"></div>
		</div>
	)
}
