/* eslint-disable camelcase */
import { ReactElement, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { WeatherStateType } from '../../store/models/base/type/weatherInfoType'
import { IndexModel } from '../../store/models/base/modelType'
import { Dispatch } from '../../store/index'
import './index.less'

export default function Weather(): ReactElement | null {
	// @ts-ignore
	const weatherState: WeatherStateType = useSelector((state: IndexModel) => state.weather)
	const dispatch = useDispatch<Dispatch>()

	useEffect(() => {
		// 这个函数会在组件首次渲染后执行一次
		console.log('weather 组件已挂载')
		if (!weatherState.weatherInfo) {
			dispatch.weather.getWeatherInfo()
		}
		// 可选的清理函数，通常用于清理副作用
		return () => {
			console.log('weather 组件将要卸载')
		}
	}, []) // 空依赖数组，确保只在首次渲染时执行

	if (!weatherState.weatherInfo) return null

	const {
		station: { city },
		publish_time,
		weather: { temperature, rain, airpressure = 0, humidity },
		wind: { direct, degree, power },
	} = weatherState.weatherInfo

	return (
		<div className="weather">
			<div className="title">
				<div className="cityname">
					<i className="locicon"></i>
					{city}
				</div>
				<div className="uptime">实况更新:{publish_time.substring(publish_time.lastIndexOf(' '))}</div>
			</div>
			<div className="temperature">
				{temperature}
				<sup className="unit">℃</sup>
			</div>
			<div className="detaillist">
				<div className="info-item">
					<div className="icon-yudi"></div>
					<div className="text">降水量</div>
					<div className="text">{rain}mm</div>
				</div>
				<div className="info-item">
					<div className="icon-qiya"></div>
					<div className="text">气压</div>
					<div className="text">{airpressure > 999 ? '一' : `${airpressure}hpa`}</div>
				</div>
				<div className="info-item">
					<div className="icon-shidu"></div>
					<div className="text">湿度</div>
					<div className="text">{humidity}%</div>
				</div>
				<div className="info-item">
					<div className="icon-fengsu"></div>
					<div className="text">{degree > 999 ? '一' : direct}</div>
					<div className="text">{power}</div>
				</div>
			</div>
		</div>
	)
}
