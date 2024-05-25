import React, { useEffect, useState, useCallback } from 'react'
import { getDateNowText } from '../../util/util'
import './index.less'

export interface Props {
	title?: string
}

export default function Header(props: Props): Element {
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
		<React.Fragment>
			<header className="header">
				<div onClick={goHome} className="title">
					<i className="logo-icon"></i>
					<span>{title}</span>
				</div>
				<div className="time">{dateText}</div>
			</header>
			<div className="headerbox"></div>
		</React.Fragment>
	)
}
