import { createModel } from '@rematch/core'
import weatherService from '../service/weather'
import type { RootModel } from '.'

export const weather = createModel<RootModel>()({
	state: {
		weatherInfo: null,
	},
	reducers: {
		SET_PLAYERS: (state, players) => {
			return {
				...state,
				weatherInfo: players,
			}
		},
	},
	effects: dispatch => {
		const { weather } = dispatch
		return {
			async getWeatherInfo(ctx): Promise<any> {
				const weatherInfo = await weatherService.getWeatherInfo(null, ctx)
				weather.SET_PLAYERS(weatherInfo)
			},
		}
	},
})
