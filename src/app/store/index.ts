import { create } from 'zustand'
import weatherServer from '../server/weather'

const indexStore = create((set, get: any) => ({
	weatherInfo: null,
	async initState(state) {
		set(state)
	},
	// 客户端初始化代码
	async ssrInit(ctx) {
		await get().getPageData(ctx)
	},
	// 客户端初始化代码
	async clientInit() {},

	// 页面请求
	async getPageData(ctx) {
		const weatherInfo = await weatherServer.getWeatherInfo(null, ctx)
		set({ weatherInfo })
	},
}))

export default indexStore
