import { createHexMap } from '$lib/vis/HexMap.svelte';
import { fitRect, getAspectRatioDifference } from '$lib/vis/d3MapHelpers.js';

function minHexSize(minSize, hex) {
	const { hexInitSize, hexWidth } = createHexMap(hex);
	return (w, h) => {
		const { s } = fitRect(hexInitSize, [w, h]);
		return hexWidth * s > minSize;
	};
}

function maxAspectRatioDiff(maxDiff, hex) {
	const { hexAR } = createHexMap(hex);
	return (w, h) => getAspectRatioDifference(hexAR, w / h) < maxDiff;
}

export { minHexSize, maxAspectRatioDiff };

// checkConditions = function (w, h) {
// 	// using constants: hexAR, hexInitSize, hexWidth
// 	let c = [
//
// 		conditions.maxAspectRatioDiff
// 			? ar / hexAR >= 1 / conditions.maxAspectRatioDiff &&
// 				ar / hexAR <= conditions.maxAspectRatioDiff
// 			: true
// 	];
// 	return c.every(Boolean);
// };
