import {
	getMapScaleTranslate,
	getMapSetup,
	getRadiusScale
} from '$lib/components/vis/circleMapPrep';

function minCircleRadius(minCircleRadius, maxCircle, projection, data) {
	const pop_vals = data.features.map((d) => d.properties.POP_EST);
	const lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)]; // find size of circle at lowest 10% size
	const r = getRadiusScale(data, maxCircle);
	const { mapAR, mapInitSize } = getMapSetup(data, projection);

	return (w, h) =>
		r(lower_bound) * getMapScaleTranslate(w, h, mapAR, mapInitSize).s > minCircleRadius; // min r - at least 90% of circles visible
}

function maxAspectRatioDiff(maxDiff, projection, data) {
	const { mapAR } = getMapSetup(data, projection);

	// aspect ratio difference - no more than 1/3 white space
	return (w, h) => w / h / mapAR >= 1 / maxDiff && w / h / mapAR <= maxDiff;
}

export { minCircleRadius, maxAspectRatioDiff };
