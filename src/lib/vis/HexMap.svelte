<script module>
	import { max, min } from 'd3-array';
	import { renderHexJSON } from 'd3-hexjson';
	import { fitRect, getAspectRatioDifference } from '$lib/vis/d3MapHelpers.js';

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

	// conditions

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
</script>

<script>
	import FillLegend from './FillLegend.svelte';
	import Tooltip from './Tooltip.svelte';

	let { data, width, height, colors, colorScale, category_labels, title } = $props();

	const hex = data.hex;
	const results = data.results;

	const { hexes, bounds, hexInitSize } = createHexMap(hex);

	// compute scale and translate (updated whenever width/height change)
	let { s, t } = $derived(fitRect(hexInitSize, [width, height]));

	// tooltip
	let tx = $state(),
		ty = $state(),
		content = $state();
	function handleMouseover(event, item) {
		tx = event.layerX + 5;
		ty = event.layerY;
		content = item.n;
	}
	function handleMouseout() {
		// clear and hide outside of viewport
		tx = -100;
		ty = -100;
		content = '';
	}
</script>

<svg {width} {height}>
	<clipPath id="hex-clip-path">
		<polygon points={hexes[0].points} />
	</clipPath>

	<g
		id="hexmap"
		transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
	>
		{#each hexes as hex (hex.key)}
			<g transform="translate({hex.x},{hex.y})">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<polygon
					class="hex"
					points={hex.points}
					stroke="#fff"
					stroke-width="2"
					fill={colorScale(results.find((x) => x.ons_id === hex.key).first_party)}
					clip-path="url(#hex-clip-path)"
					onfocus={(e) => handleMouseover(e, hex)}
					onmouseover={(e) => handleMouseover(e, hex)}
					onmouseout={handleMouseout}
					onblur={handleMouseout}
				/>
			</g>
		{/each}
		<FillLegend
			{colors}
			labels={category_labels}
			{title}
			x={hexInitSize[0] + bounds[0][0] - 3}
			y={bounds[0][1] + 3}
			anchorX="right"
			s="0.97"
		/>
	</g>
	<Tooltip
		bind:x={tx}
		bind:y={ty}
		bind:content
		backgroundColor="#fffd"
		textAnchor="left"
		dominantBaseline="top"
	/>
</svg>

<style>
	polygon:hover {
		stroke: none;
	}
</style>
