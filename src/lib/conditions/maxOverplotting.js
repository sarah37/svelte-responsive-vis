import { extent, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';

function dist(a, b) {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	return Math.sqrt(dx * dx + dy * dy);
}

export function maxOverplotting(
	maxScore,
	pos,
	r,
	marginX = 0,
	marginY = 0,
	xDomain = undefined,
	yDomain = undefined
) {
	// if x/y range are not provided, use the min/max values in the dataset
	xDomain = xDomain ?? extent(pos, (d) => d[0]);
	yDomain = yDomain ?? extent(pos, (d) => d[1]);

	// n choose 2 -- the number of unique pairs in the dataset
	// this number is what the overlap score would be if all points were fully identical
	const normalization_factor = (pos.length * (pos.length - 1)) / 2;

	const cellSize = 2 * r; // smallest cell that will capture all potentially overlapping circles within its direct neighbors

	return (w, h) => {
		if (!w || !h) return true;
		// recreate scales used in the scatterplot
		// ensuring that range does not go negative
		const x = scaleLinear()
			.domain(xDomain)
			.range([0, max([0, w - marginX])]);
		const y = scaleLinear()
			.domain(yDomain)
			.range([0, max([0, h - marginY])]);

		// define grid parameters
		const cols = Math.ceil(w / cellSize) + 1;
		const rows = Math.ceil(h / cellSize) + 1;

		// initialize empty grid array
		const grid = Array.from({ length: cols }, () => Array.from({ length: rows }, () => []));

		// apply scales to data
		const positions = pos.map(([px, py]) => [x(px), y(py)]);

		// map data into grid
		positions.forEach(([px, py], i) => {
			const col = Math.floor(px / cellSize);
			const row = Math.floor(py / cellSize);
			try {
				grid[col][row].push(i);
			} catch {
				console.warn(
					`grid mapping failed: col ${col} row ${row} px ${px} py ${py} i ${i} cols ${cols} ${grid.length} rows ${rows} ${grid[0].length} `
				);
			}
		});

		// initialize var for overplotting score
		let overplotting = 0;

		// for each data point, check points in its own grid cell and the surrounding 8 for overlap
		for (let i = 0; i < positions.length; i++) {
			// get position of current point
			const [px, py] = positions[i];
			// get grid cell row/col of current point
			const currentCol = Math.floor(px / cellSize);
			const currentRow = Math.floor(py / cellSize);
			// check surrounding grid cells
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					if (
						currentCol + dx >= 0 &&
						currentRow + dy >= 0 &&
						currentCol + dx < cols &&
						currentRow + dy < rows
					) {
						const currentCell = grid[currentCol + dx][currentRow + dy];
						// iterate through all points in cell
						for (const j of currentCell) {
							// so we don't double count and don't compare points to themselves
							if (j > i) {
								// check distance between points
								const d = dist([px, py], positions[j]);
								// get value between 0 and 1 for amount of overlap
								// 1 = identical positions; 0 = no overlap
								if (d < 2 * r) {
									overplotting += (2 * r - d) / (2 * r);
								}
							}
						}
					}
				}
			}
		}
		return overplotting / normalization_factor < maxScore;
	};
}
