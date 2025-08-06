<script>
	import { scaleLinear } from 'd3';

	import embed from 'vega-embed';

	let { data, params, conditions, context, display, checkConditions = $bindable() } = $props();

	// these seem to be the same for every plot
	const margin = {
		top: 10,
		bottom: 35,
		left: 45,
		right: 3
	};
	// unique div id
	const uid = $props.id();
	const div = `vegalite-div-${uid}`;

	// size of container
	let height = $derived(context.height);
	let width = $derived(context.width);

	$effect(() => {
		// container sizing in vega listens to the window resize event,
		// so we manually trigger this event here when the container size changes
		(height, width);
		window.dispatchEvent(new Event('resize'));
	});

	const options = { renderer: 'canvas', actions: false };

	let spec = $derived({
		...params.spec,
		width: 'container',
		height: 'container',
		...(typeof params.filter === 'function' && {
			transform: [{ filter: params.filter(width, height) }]
		})
	});

	$effect(() => {
		embed('#' + div, spec, options).catch(console.error);
	});

	// CONDITIONS
	// compute overplotting
	const ratings = data.default
		.map((d) => {
			return [d['IMDB Rating'], d['Rotten Tomatoes Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null
	const radius = 3.09; // default size of vega-lite circle is 30, i.e. radius of 3.09

	// n choose 2 -- the number of unique pairs in the dataset
	// this number is what the overlap score would be if all points were fully identical
	const normalization_factor = (ratings.length * (ratings.length - 1)) / 2;

	function dist(a, b) {
		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		return Math.sqrt(dx * dx + dy * dy);
	}

	function computeOverplotting(pos, r, w, h) {
		if (!r | !w | !h | !pos.length) {
			console.log(
				`skipping condition check -- something not (yet) defined: r: ${r} w: ${w} h: ${h} pos.length: ${pos.length} `
			);
			return false;
		}

		// recreate scales used internally in vega
		const x = scaleLinear().domain([0, 10]).range([0, w]);
		const y = scaleLinear().domain([0, 100]).range([0, h]);

		// define grid parameters
		const cellSize = 2 * r;
		const cols = Math.ceil(w / cellSize);
		const rows = Math.ceil(h / cellSize);

		// initialize empty grid array
		const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => []));

		// apply scales to data
		const positions = pos.map(([px, py]) => [x(px), y(py)]);

		// map data into grid
		positions.forEach(([px, py], i) => {
			const col = Math.floor(px / cellSize);
			const row = Math.floor(py / cellSize);
			try {
				grid[row][col].push(i);
			} catch {
				console.warn(`grid mapping failed: col ${col} row ${row}`);
				// console.table(grid);
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
						currentRow + dx >= 0 &&
						currentCol + dy >= 0 &&
						currentRow + dx < rows &&
						currentCol + dy < cols
					) {
						const currentCell = grid[currentRow + dx][currentCol + dy];
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
		return overplotting / normalization_factor;
	}

	checkConditions = function (w, h) {
		let c = [
			conditions.maxOverplotting
				? computeOverplotting(ratings, radius, w, h) < conditions.maxOverplotting
				: true,
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true
		];
		return c.every(Boolean);
	};
</script>

<div
	id={div}
	style="display: {display
		? 'block'
		: 'none'}; height: {context.height}px; width: {context.width}px"
></div>
