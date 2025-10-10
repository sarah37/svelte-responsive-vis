import { max, min } from 'd3-array';
import { renderHexJSON } from 'd3-hexjson';

function createHexMap(hex) {
	// Initialize the hexes at an arbitrary size of 500x500
	const hexes = renderHexJSON(hex, 500, 500);
	// get positions of vertices (same for all hexes)
	const vertices = hexes[0].vertices;
	const vertices_x = vertices.map((d) => d.x);
	const vertices_y = vertices.map((d) => d.y);

	// get bounds of positions
	const bounds = [
		[min(hexes, (d) => d.x) + min(vertices_x), min(hexes, (d) => d.y) + min(vertices_y)],
		[max(hexes, (d) => d.x) + max(vertices_x), max(hexes, (d) => d.y) + max(vertices_y)]
	];

	const hexAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
	const hexInitSize = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];

	// get width of first hex (which is the same as all others)
	const hexWidth = max(hexes[0].vertices, (d) => d.x) - min(hexes[0].vertices, (d) => d.x);

	return { hexes, bounds, hexAR, hexInitSize, hexWidth };
}

export { createHexMap };
