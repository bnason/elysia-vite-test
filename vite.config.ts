import type { UserConfig } from 'vite';

import Vue from '@vitejs/plugin-vue';
import SvgLoader from 'vite-svg-loader';

const config: UserConfig = {
	plugins: [Vue(), SvgLoader()],
	resolve: {
		alias: {
			'~': './src/',
		},
	},
};

export default config;
