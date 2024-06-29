interface StationType {
	code: string
	province: string
	city: string
	url: string
}

interface WeatherType {
	temperature: number
	temperatureDiff: number
	airpressure: number
	humidity: number
	rain: number
	rcomfort: number
	icomfort: number
	info: string
	img: string
	feelst: number
}

interface WindType {
	direct: string
	degree: number
	power: string
	speed: number
}

interface WarnType {
	alert: string
	pic: string
	province: string
	city: string
	url: string
	issuecontent: string
	fmeans: string
	signaltype: string
	signallevel: string
	pic2: string
}

interface WeatherInfoType {
	station: StationType
	publish_time: string
	weather: WeatherType
	wind: WindType
	warn: WarnType
}

export interface WeatherStateType {
	weatherInfo: WeatherInfoType | null
}
