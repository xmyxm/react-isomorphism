interface TripItemType {
	id: number
	name: string
}

export interface TripInfoType {
	title: string
	list: TripItemType[]
}

export interface TripMenuStateType {
	tripMenuInfo: TripInfoType | null
}
