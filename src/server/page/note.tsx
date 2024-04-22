import React from 'react';
import { renderToString } from 'react-dom/server';
import { Note } from '../../app/page/note';

async function pageRender(ctx): Promise<any> {
	// const { address = '' } = ctx.query;
	const html: string = renderToString(<Note />);
	return {
		html,
	};
}

export default pageRender;
