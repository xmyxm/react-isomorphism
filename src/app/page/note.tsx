import React from 'react';
import Header from '../component/header';
import Footer from '../component/footer';
import '../style/note.less';

export function Note() {
	return (
		<React.Fragment>
			<Header title="同构详情首页"></Header>
			<Footer />
		</React.Fragment>
	);
}

export default { Note };
