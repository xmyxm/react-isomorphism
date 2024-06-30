/* eslint-disable camelcase */
import { ReactElement } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IndexModel } from '../../store/models/base/modelType'
import { Dispatch } from '../../store/index'
import { TripMenuStateType, TripItemType } from '../../store/models/base/type/tripmenuType'
import './index.less'

export default function TripMenu(): ReactElement | null {
	// @ts-ignore
	const tripMenuState: TripMenuStateType = useSelector((state: IndexModel) => state.tripMenu)
	const dispatch = useDispatch<Dispatch>()

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
