export interface TripDetailItemType {
	ID: string
	DJ: string
	DZ: string
	DH: string
	MC: string
	JD: string
	WD: string
}

export interface RenderConfigType {
	headers: string[]
	columns: string[]
}

export interface TripDetailInfoType {
	title: string
	renderConfig: RenderConfigType
	list: TripDetailItemType[] | null
}

export interface TripDetailStateType {
	tripDetailInfo: TripDetailInfoType | null
}
