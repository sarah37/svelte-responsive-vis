import {
	fitRect,
	getAreaSize,
	getMapScaleTranslate,
	getMapSetup,
	getRadiusScale
} from '$lib/vis/d3MapHelpers';
import { min } from 'd3-array';

export function minCircleRadius(minCircleRadius, maxCircle, projection, data) {
	const pop_vals = data.features.map((d) => d.properties.POP_EST);
	const lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)]; // find size of circle at lowest 10% size
	const r = getRadiusScale(data, maxCircle);
	const { mapAR, mapInitSize } = getMapSetup(data, projection);

	return (w, h) =>
		r(lower_bound) * getMapScaleTranslate(w, h, mapAR, mapInitSize).s > minCircleRadius; // min r - at least 90% of circles visible
}

export function maxAspectRatioDiff(maxDiff, projection, data) {
	const { mapAR } = getMapSetup(data, projection);

	// aspect ratio difference - limit white space
	return (w, h) => w / h / mapAR >= 1 / maxDiff && w / h / mapAR <= maxDiff;
}

export function minAreaSize(minSize, projection, data) {
	const { path, mapInitSize } = getMapSetup(data, projection);

	// get area sizes
	data.features.forEach((feature) => {
		feature.area = getAreaSize(feature, path);
		return feature;
	});

	// get smallest area
	const smallestArea = min(data.features, (d) => d.area);

	return (w, h) => {
		const { s } = fitRect(mapInitSize, [w, h]);
		// times s^2 because area scales quadratically
		return smallestArea * s * s > minSize;
	};
}
