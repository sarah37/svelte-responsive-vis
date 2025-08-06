// config for github pages

import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : '/responsive-vis-collection'
		}
	}
};

export default config;
