import { fitRect, getAreaSize, getMapSetup } from '$lib/vis/d3MapHelpers';
import { min } from 'd3-array';

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
