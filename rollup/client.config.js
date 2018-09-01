import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import config from 'sapper/config/rollup.js';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

export default {
	input: config.client.input(),
	output: config.client.output(),
	plugins: [
		svelte({
			dev,
			hydratable: true
		}),
		resolve(),
		replace({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
		commonjs(),

		legacy && babel({
			extensions: ['.js', '.html'],
			runtimeHelpers: true,
			exclude: ['node_modules/@babel/**'],
			presets: [
				['@babel/preset-env', {
					targets: '> 0.25%, not dead'
				}]
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				['@babel/plugin-transform-runtime', {
					useESModules: true
				}]
			]
		}),

		!dev && compiler({
			// externs: [
			// 	'./node_modules/google-closure-compiler/contrib/externs/svg.js',
			// 	'./externs.js',
			// ],
			// compilation_level: 'ADVANCED',
			// dependency_mode: 'LOOSE',
			// warning_level: 'VERBOSE',

			// uncomment for debugging
			// formatting: 'PRETTY_PRINT',
			// debug: true,
		}),
	],
	experimentalCodeSplitting: true
};
