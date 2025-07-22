<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import { scaleLinear } from 'd3';
	import { dist } from '$lib/helpers.js';
	import { VegaLite } from 'svelte-vega';

	// size of container
	$: height = context.height;
	$: width = context.width;

	let options = { renderer: 'svg', actions: false };

	$: spec = {
		...params.spec,
		width: width - 20,
		height: height - 20,
		autosize: 'fit',
		...(typeof params.filter === 'function' && {
			transform: [{ filter: params.filter(width, height) }]
		})
	};

	// CONDITIONS
	// compute overplotting
	// if (conditions.maxOverplotting) {
	const ratings = data.default
		.map((d) => {
			return [d['Rotten Tomatoes Rating'], d['IMDB Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null
	const radius = 3.09; // default size of vega-lite circle is 30, i.e. radius of 3.09

	let total = (ratings.length * (ratings.length + 1)) / 2 - ratings.length;

	function computeOverplotting(pos, r, w, h) {
		// recreate scales used internally in vega
		let x = scaleLinear().domain([0, 10]).range([0, w]);
		let y = scaleLinear().domain([0, 100]).range([0, h]);

		// apply scales
		let positions = pos.map((d) => {
			return [x(d[0]), y(d[1])];
		});
		let overplotting = 0;
		// for each complete data point, check how many others it overlaps with
		for (let i = 0; i < positions.length; i++) {
			// check only starting at the current index so we don't overcount
			// +1 to skip itself
			for (let j = i + 1; j < positions.length; j++) {
				// get distance between the two points at i and j
				let d = dist(positions[i], positions[j]);

				// get value between 0 and 1 for amount of overlap
				// 1 = identical positions; 0 = no overlap
				overplotting += d < 2 * r ? (2 * r - d) / (2 * r) : 0;
			}
		}
		return overplotting / total;
	}

	checkConditions = function (w, h) {
		let c = [
			// hack to make it compute faster
			conditions.maxOverplotting && !(w > 220 && h > 250)
				? !(w > 150 && h > 200)
					? false
					: computeOverplotting(ratings, radius, w - 120, h - 110) < conditions.maxOverplotting
				: true,
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true
		];
		return c.every(Boolean);
	};
</script>

{#if display}
	<VegaLite {data} {spec} />
{/if}
