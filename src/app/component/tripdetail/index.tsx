/* eslint-disable camelcase */
import { ReactElement, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TripDetailStateType, TripDetailItemType } from '../../store/models/base/type/tripdetaillistType'
import { NoteModel } from '../../store/models/base/modelType'
import { Dispatch } from '../../store/index'
import './index.less'

export default function TripDetail(): ReactElement | null {
	// @ts-ignore
	const tripDetailState: TripDetailStateType = useSelector((state: NoteModel) => state.tripDetail)
	const dispatch = useDispatch<Dispatch>()

	useEffect(() => {
		// 这个函数会在组件首次渲染后执行一次
		console.log('tripmenu 组件已挂载')
		if (!tripDetailState.tripDetailInfo) {
			dispatch.tripDetail.getTripDetailList()
		}
		// 可选的清理函数，通常用于清理副作用
		return () => {
			console.log('tripmenu 组件将要卸载')
		}
	}, []) // 空依赖数组，确保只在首次渲染时执行

	if (!tripDetailState.tripDetailInfo) return null

	const { title, renderConfig, list } = tripDetailState.tripDetailInfo

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
