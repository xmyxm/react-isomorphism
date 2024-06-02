const fs = require('fs')
const LZString = require('lz-string')
const userList = require('../config/user')
const getTime = require('../util/util')
const print = require('../util/print-log')

const cacheData = {}

// 文章读取服务
function getNote(ctx) {
	const { address = '', getmenu = false } = ctx.query

	const result = {
		code: 200,
		data: {},
		msg: '成功',
	}

	try {
		let userInfo
		const token = ctx.cookies.get('token')
		if (token) {
			userInfo = userList.find(item => item.hash === token)
		}

		if (getmenu) {
			result.data = getNoteMenuList(userInfo, address)
		}

		if (userInfo) {
			result.data.username = userInfo.name
		}

		if (address || (result.data && result.data.address)) {
			const link = address || result.data.address
			if (identityCheck(link, userInfo)) {
				const filePath = `notes/${link}.md`
				const contentData = getNoteDetail(filePath)

				if (contentData) {
					result.data.contentData = contentData
				} else {
					result.code = 404
					result.msg = '文件不存在'
					print.warn(`${getTime()} 文件不存在`)
				}
			} else {
				result.code = 500
				result.msg = '权限不足'
				print.warn(`${getTime()} 权限不足`)
			}
		}

		result.data.loading = false
	} catch (err) {
		result.code = 500
		result.msg = err.toString()
	}
	ctx.body = result
}

// 读取笔记菜单
function getNoteMenuList(userInfo, address) {
	let groupName = ''
	let fileName = ''
	let status = false
	let newAddress = address
	let title = ''

	if (newAddress) {
		const arlist = newAddress.split('/')
		const [gName, fName] = arlist
		groupName = gName
		fileName = fName
		status = true
	}

	// 菜单默认都展开
	const open = true
	// eslint-disable-next-line global-require
	const noteGroup = require('../../../dist/server/notegroup')
	const menuList = Object.keys(noteGroup.group)
		.map(key => {
			const { icon, noteList } = noteGroup.group[key]
			const dataList = (userInfo ? noteList : noteList.filter(item => !item.hide)).map(item => {
				let select = false
				if (status) {
					if (groupName === key && item.fileName === fileName) {
						select = true
						title = item.title
					}
				} else if (!newAddress) {
					select = true
					newAddress = `${key}/${item.fileName}`
				}
				const data = {
					fileName: item.fileName,
					title: item.title,
					select,
				}
				return data
			})

			return {
				key,
				icon,
				open,
				noteList: dataList,
			}
		})
		.filter(data => data.noteList.length)

	return {
		title,
		address: newAddress,
		menuList,
	}
}

// 读取笔记内容
function getNoteDetail(filePath) {
	let data = null
	if (cacheData[filePath]) {
		data = cacheData[filePath]
	} else if (fs.existsSync(filePath)) {
		print.info(`${getTime()}文件读取`)
		const fileInfo = fs.statSync(filePath)
		const text = fs.readFileSync(filePath, 'utf-8')
		const { size, atime, birthtime, mtime, ctime } = fileInfo
		data = {
			size,
			// 文件的大小
			atime: atime.getTime(),
			// 文件最后一次访问的时间
			birthtime: birthtime.getTime(),
			// 文件创建的时间
			mtime: mtime.getTime(),
			// 文件最后一次修改时间
			ctime: ctime.getTime(),
			// 状态发生变化的时间
			text: LZString.compress(text),
			// 文件内容
		}
		cacheData[filePath] = data
	}
	return data
}

// 笔记鉴权
function identityCheck(address, userInfo) {
	if (userInfo) return true
	const [groupName, fileName] = address.split('/')
	// eslint-disable-next-line global-require
	const noteGroup = require('../../../dist/server/notegroup')
	const { noteList } = noteGroup.group[groupName]
	const noteInfo = noteList.find(item => !item.hide && !item.hideContent && item.fileName === fileName)
	return !!noteInfo
}

module.exports = getNote
