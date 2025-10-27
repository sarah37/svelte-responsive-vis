// config for github pages

import adapter from '@sveltejs/adapter-static';
import * as url from 'url';
import path from 'path';

const dev = process.argv.includes('dev');
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : '/svelte-responsive-vis'
		},
		alias: {
			'svelte-responsive-vis': path.resolve(__dirname, './src/lib')
		}
	}
};

export default config;
