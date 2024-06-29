import { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IndexModel } from '../../store/models/base/modelType'
import './index.less'

export default function Weather(): ReactElement {
	const weatherState = useSelector((state: IndexModel) => state.weather)
	// const menuState = useSelector((state: IndexModel) => state.tripMenu)
	// const dispatch = useDispatch<Dispatch>()

	return <div className="weather">{JSON.stringify(weatherState.weatherInfo || {})}</div>
}
