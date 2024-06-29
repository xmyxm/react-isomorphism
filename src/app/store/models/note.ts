import { Models } from '@rematch/core'
import { user } from './user'
import { review } from './review'

export interface NoteRootModel extends Models<NoteRootModel> {
	user: typeof user
	review: typeof review
}

export const models: NoteRootModel = { user, review }
