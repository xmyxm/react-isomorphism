import { Models } from '@rematch/core'
import { players } from './players'
import { settings } from './settings'
import { weather } from './weather'
import { cart } from './cart'

export interface RootModel extends Models<RootModel> {
	players: typeof players
	cart: typeof cart
	settings: typeof settings
	weather: typeof weather
}

export const models: RootModel = { players, settings, cart, weather }
