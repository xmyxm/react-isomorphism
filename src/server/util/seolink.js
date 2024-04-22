const fs = require('fs');

// 更新 seolink.txt 文件
function start() {
	const noteGroup = require('../../dist/server/notegroup');
	const host = 'https://qqweb.top/';
	const hrefList = [host];
	Object.keys(noteGroup.group).forEach(key => {
		const { noteList } = noteGroup.group[key];
		noteList
			.filter(item => !item.hide && !item.hideContent)
			.forEach(item => {
				hrefList.push(`${host}note?address=${key}${encodeURIComponent('/')}${item.fileName}`);
			});
	});
	hrefList;
	update(hrefList.join('\n'));
}

// 写入链接
function update(content) {
	fs.writeFile('./webfile/seolink.txt', content, 'utf8', error => {
		if (error) return console.log('写入文件失败,原因是' + error.message);
		console.log('seolink.txt 写入成功');
	});
}

// 启动
start();
