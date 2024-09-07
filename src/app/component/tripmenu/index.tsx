/* eslint-disable camelcase */
import { ReactElement, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IndexModel } from '../../store/models/base/modelType'
import { Dispatch } from '../../store/index'
import { TripMenuStateType, TripItemType } from '../../store/models/base/type/tripmenuType'
import './index.less'

export default function TripMenu(): ReactElement | null {
	// @ts-ignore
	const tripMenuState: TripMenuStateType = useSelector((state: IndexModel) => state.tripMenu)
	const dispatch = useDispatch<Dispatch>()

	useEffect(() => {
		// 这个函数会在组件首次渲染后执行一次
		console.log('tripmenu 组件已挂载')
		if (!tripMenuState.tripMenuInfo) {
			dispatch.tripMenu.getTripMenuList()
		}
		// 可选的清理函数，通常用于清理副作用
		return () => {
			console.log('tripmenu 组件将要卸载')
		}
	}, []) // 空依赖数组，确保只在首次渲染时执行

	if (!tripMenuState.tripMenuInfo) return null

	const { title, list } = tripMenuState.tripMenuInfo

	return (
		<div className="tripmenu">
			<div className="title">{title}</div>
			<div className="menulist">
				{list.map(({ id, name }: TripItemType) => {
					return (
						<div
							key={id}
							onClick={() => {
								dispatch.tripMenu.goTodetail(id)
							}}
							className="name"
						>
							{name}
						</div>
					)
				})}
			</div>
		</div>
	)
}
