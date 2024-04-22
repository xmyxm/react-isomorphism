import React from 'react';
import { renderToString } from 'react-dom/server';
import { Index } from '../../app/page/index';

function pageRender(): string {
	return renderToString(<Index />);
}

export default pageRender;
