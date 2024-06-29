import { createModel } from '@rematch/core'
import weatherService from '../../service/weather'
import { WeatherStateType } from './type/weatherInfoType'
import type { IndexModel } from './modelType'

export const weather = createModel<IndexModel>()({
	state: {
		weatherInfo: null,
	} as WeatherStateType,
	reducers: {
		SET_WEATHER: (state, players) => {
			return {
				...state,
				weatherInfo: players,
			}
		},
	},
	effects: dispatch => {
		return {
			async getWeatherInfo(ctx): Promise<any> {
				const weatherInfo = await weatherService.getWeatherInfo(null, ctx)
				dispatch.weather.SET_WEATHER(weatherInfo)
			},
		}
	},
})
