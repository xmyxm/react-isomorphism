import { createSlice } from '@reduxjs/toolkit'
import weatherServer from '../server/weather'

https://juejin.cn/post/7190642427026210876
https://blog.csdn.net/weixin_57017198/article/details/133796912

const indexStore = createSlice({
	name: 'index-slice',
	initialState: {
		weatherInfo: null
	},
	reducers: {
		// 客户端初始化代码
		async ssrInit(ctx) {
			console.log('------------------------ 发请求')
			await get().getPageData(ctx)
		},
		// 客户端初始化代码
		async clientInit() {},

		// 页面请求
		async getPageData(ctx) {
			const weatherInfo = await weatherServer.getWeatherInfo(null, ctx)
			set({ weatherInfo })
		},
	}
})

