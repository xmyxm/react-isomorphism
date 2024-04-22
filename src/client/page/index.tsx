/*
 * @Author: cxf
 * @Date: 2020-11-03 20:47:05
 * @LastEditTime: 2020-12-29 11:26:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Index } from '../../app/page/index';

const container = document.getElementById('main');
const root = createRoot(container);
root.render(<Index />);
