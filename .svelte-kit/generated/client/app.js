export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10')
];

export const server_loads = [];

export const dictionary = {
		"/(public)": [10,[3]],
		"/(app)/dashboard": [4,[2]],
		"/(app)/settings": [5,[2]],
		"/(app)/settings/fields": [6,[2]],
		"/(app)/settings/fields/[id]": [7,[2]],
		"/(app)/settings/layouts": [8,[2]],
		"/(app)/settings/layouts/[id]": [9,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';