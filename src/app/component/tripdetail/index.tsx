/* eslint-disable camelcase */
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { NoteModel } from '../../store/models/base/modelType'
import { TripDetailStateType, TripDetailItemType } from '../../store/models/base/type/tripdetaillistType'
import './index.less'

export default function TripDetail(): ReactElement | null {
	// @ts-ignore
	const tripMenuState: TripDetailStateType = useSelector((state: NoteModel) => state.tripDetail)

	if (!tripMenuState.tripDetailInfo) return null

	const { title, renderConfig, list } = tripMenuState.tripDetailInfo

	return (
		<div className="tripdetail">
			<div className="title">{title}</div>
			{renderConfig ? (
				<table className="detaillist">
					<thead>
						<tr className="head-item">
							<th className="xh">序号</th>
							{renderConfig.headers.map(text => {
								return <th key={text}>{text}</th>
							})}
						</tr>
					</thead>

					<tbody>
						{list
							? list.map((item: TripDetailItemType, index) => {
									return (
										<tr key={item.ID} className="body-item">
											<td>{index + 1}</td>
											{renderConfig.columns.map(key => {
												return <td key={key}>{item[key]}</td>
											})}
										</tr>
									)
							  })
							: null}
					</tbody>
				</table>
			) : null}
		</div>
	)
}
