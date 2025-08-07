import { geoPath, scaleSqrt, max } from 'd3';

function getRadiusScale(data, maxCircle) {
	return scaleSqrt()
		.domain([0, max(data.features, (d) => d.properties.POP_EST)])
		.range([0, maxCircle]);
}

function getMapSetup(data, projection) {
	// fit projection to container + geo data
	const path = geoPath(projection);
	const bounds = path.bounds(data);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
	const mapInitSize = { width: bounds[1][0] - bounds[0][0], height: bounds[1][1] - bounds[0][1] };
	return { path, bounds, mapAR, mapInitSize };
}

function getMapScaleTranslate(w, h, ar, initSize) {
	const s = ar > w / h ? w / initSize.width : h / initSize.height;
	const t = ar < w / h ? [(w - s * initSize.width) / 2, 0] : [0, (h - s * initSize.height) / 2];
	return { s, t };
}

export { getRadiusScale, getMapSetup, getMapScaleTranslate };
