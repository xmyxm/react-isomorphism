import React from 'react'
import Head from '../component/head'
import Foot from '../component/foot'
import '../style/note.less'

export function Note() {
	const a = `
	function replacer(key, value) {
		// 如果我们遇到一个属性引用了自身，则将其排除（不序列化）
		if (value === head_1) {
		  return undefined;
		}
		return value;
	  }
	  
	  const jsonString = JSON.stringify(head_1, replacer);
	  console.log('---------------------------1', JSON.stringify(head_1))
	`
	eval(a)
	console.log('---------------------------2', Foot)
	return (
		<div>
			<Head title="同构模板Note" />
			<Foot />
		</div>
	)
}

export default Note
