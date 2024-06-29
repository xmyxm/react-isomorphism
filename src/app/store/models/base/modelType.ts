import { Models } from '@rematch/core'
import { weather } from './weather'
import { tripMenu } from './tripmenu'
import { tripDetail } from './tripdetail'

export interface IndexModel extends Models<IndexModel> {
	weather: typeof weather
	tripMenu: typeof tripMenu
}

export interface NoteModel extends Models<NoteModel> {
	tripDetail: typeof tripDetail
}
