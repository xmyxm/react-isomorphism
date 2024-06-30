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
				<div className="uptime">更新时间:{publish_time.substring(publish_time.lastIndexOf(' '))}</div>
			</div>
			<div className="temperature">
				{temperature}
				<sup className="unit">℃</sup>
			</div>
			<div className="detaillist">
				<div className="info-item">
					<img className="icon" />
					<div className="text">降水量</div>
					<div className="text">{rain}mm</div>
				</div>
				<div className="info-item">
					<div className="icon"></div>
					<div className="text">气压</div>
					<div className="text">{airpressure}hpa</div>
				</div>
				<div className="info-item">
					<div className="icon"></div>
					<div className="text">湿度</div>
					<div className="text">{humidity}%</div>
				</div>
				<div className="info-item">
					<div className="icon"></div>
					<div className="text">{direct}</div>
					<div className="text">{power}</div>
				</div>
			</div>
			{/* {JSON.stringify(weatherState.weatherInfo || {})} */}
		</div>
	)
}
