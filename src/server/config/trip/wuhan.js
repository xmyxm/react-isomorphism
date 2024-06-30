const config = {
	title: '武汉文旅名录',
	list: [
		{
			name: '剧院剧场',
			id: 1719743754163,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/lyjq/list.json',
			renderConfig: {
				headers: ['场馆名称', '地址'],
				columns: ['MC', 'DZ'],
			},
		},
		{
			name: 'A级景区',
			id: 1719743720771,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/lyjq/list.json',
			renderConfig: {
				headers: ['名称', '等级', '地址'],
				columns: ['MC', 'DJ', 'DZ'],
			},
		},
		{
			name: '图书馆',
			id: 1719743628267,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/tsgcx/list.json',
			renderConfig: {
				headers: ['单位名称', '详细地址'],
				columns: ['DWMC', 'XXDZ'],
			},
		},
		{
			name: '博物馆',
			id: 1719743681396,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/bwgcx/list.json',
			renderConfig: {
				headers: ['单位', '开放时间', '地址'],
				columns: ['DW', 'KFSJ', 'DZ'],
			},
		},
		{
			name: '星级饭店',
			id: 1719743600881,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/lvfd/list.json',
			renderConfig: {
				headers: ['名称', '等级', '地址'],
				columns: ['MC', 'DJ', 'DZ'],
			},
		},
		{
			name: '文物保护单位',
			id: 1719743791293,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/wwbhdw/wwbhdw.json',
			renderConfig: {
				headers: ['名称', '时代', '级别', '地点'],
				columns: ['MC', 'SD', 'JB', 'DD'],
			},
		},
		{
			name: '非遗名录',
			id: 1719743826550,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/fymlcx/list.json',
			renderConfig: {
				headers: ['项目名称', '项目类别', '申报单位', '等级'],
				columns: ['XMMC', 'XMLB', 'SQDWHDQ', 'BZ'],
			},
		},
		{
			name: '名镇名村名街',
			id: 1719743847527,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/mzmcmj/list.json',
			renderConfig: {
				headers: ['名称', '级别', '地址', '备注'],
				columns: ['MC', 'JB', 'DZ', 'BZ'],
			},
		},
		{
			name: '文化艺术团体',
			id: 1719743899368,
			api: 'https://wlj.wuhan.gov.cn/bsfw_27/wlml/ystt/list.json',
			renderConfig: {
				headers: ['名称', '地址'],
				columns: ['MC', 'DZ'],
			},
		},
	],
}

module.exports = config
