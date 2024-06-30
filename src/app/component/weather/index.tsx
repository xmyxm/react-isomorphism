/* eslint-disable camelcase */
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { IndexModel } from '../../store/models/base/modelType'
import { WeatherStateType } from '../../store/models/base/type/weatherInfoType'
import './index.less'

export default function Weather(): ReactElement | null {
	// @ts-ignore
	const weatherState: WeatherStateType = useSelector((state: IndexModel) => state.weather)
	// const menuState = useSelector((state: IndexModel) => state.tripMenu)
	// const dispatch = useDispatch<Dispatch>()

	if (!weatherState.weatherInfo) return null

	const {
		station: { city },
		publish_time,
		weather: { temperature, rain, airpressure, humidity },
		wind: { direct, power },
	} = weatherState.weatherInfo

	return (
		<div className="weather">
			<div className="title">
				<div className="cityname">
					<i className="locicon"></i>
					{city}
				</div>
				<div className="uptime">{publish_time}</div>
			</div>
			<div className="temperature">{temperature}</div>
			<div className="detaillist">
				<div>
					<img className="icon" />
					<div className="text">降水量</div>
					<div className="text">{rain}mm</div>
				</div>
				<div>
					<div className="icon"></div>
					<div className="text">气压</div>
					<div className="text">{airpressure}hpa</div>
				</div>
				<div>
					<div className="icon"></div>
					<div className="text">湿度</div>
					<div className="text">{humidity}%</div>
				</div>
				<div>
					<div className="icon"></div>
					<div className="text">{direct}</div>
					<div className="text">{power}</div>
				</div>
			</div>
			{/* {JSON.stringify(weatherState.weatherInfo || {})} */}
		</div>
	)
}
