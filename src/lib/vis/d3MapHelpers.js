// helper/setup functions for d3 maps

import { geoPath } from 'd3-geo';

export function getAreaSize(feature, path) {
	// Find the size of the largest polygon in sq px
	// Source: https://observablehq.com/d/47c257e62a34b61d
	const geometry = feature.geometry;
	if (geometry.type === 'Polygon') {
		return path.area(feature);
	} else {
		let largestPolygon = {},
			largestArea = 0;
		geometry.coordinates.forEach((coordinates) => {
			const polygon = { type: 'Polygon', coordinates },
				area = path.area(polygon);
			if (area > largestArea) {
				largestPolygon = polygon;
				largestArea = area;
			}
		});
		return path.area(largestPolygon);
	}
}

export function getMapSetup(data, projection) {
	// fit projection to container + geo data
	const path = geoPath(projection);
	const bounds = path.bounds(data);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
	const mapInitSize = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
	return { path, bounds, mapAR, mapInitSize };
}

export function getMapScaleTranslate(w, h, ar, initSize) {
	const s = ar > w / h ? w / initSize[0] : h / initSize[1];
	const t = ar < w / h ? [(w - s * initSize[0]) / 2, 0] : [0, (h - s * initSize[1]) / 2];
	return { s, t };
}

export function fitRect(inner, outer) {
	// returns scale and translate for fitting the inner rectangle
	// into the outer rectangle, centered at maximum size possible
	// inner = [width, height]
	// outer = [width, height]
	let innerAR = inner[0] / inner[1];
	let outerAR = outer[0] / outer[1];
	let s, t;
	if (innerAR > outerAR) {
		s = outer[0] / inner[0];
		t = [0, (outer[1] - s * inner[1]) / 2];
	} else {
		s = outer[1] / inner[1];
		t = [(outer[0] - s * inner[0]) / 2, 0];
	}
	return { s, t };
}

export function getAspectRatioDifference(ar1, ar2) {
	// return factor that ar2 is larger or smaller than ar1 by
	return ar1 > ar2 ? ar1 / ar2 : ar2 / ar1;
}
