<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import * as d3 from 'd3';
	import { renderHexJSON } from 'd3-hexjson';

	import { fitRect } from '$lib/helpers.js';
	import FillLegend from '$lib/components/FillLegend.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	$: height = context.height;
	$: width = context.width;

	const hex = data.hex;
	const results = data.results;

	// Initialize the hexes at an arbitrary size of 500x500
	const hexes = renderHexJSON(hex, 500, 500);

	// get positions of vertices (same for all hexes)
	const vertices = hexes[0].vertices;
	const vertices_x = vertices.map((d) => d.x);
	const vertices_y = vertices.map((d) => d.y);

	// get bounds of positions
	const bounds = [
		[
			d3.min(hexes, (d) => d.x) + d3.min(vertices_x),
			d3.min(hexes, (d) => d.y) + d3.min(vertices_y)
		],
		[d3.max(hexes, (d) => d.x) + d3.max(vertices_x), d3.max(hexes, (d) => d.y) + d3.max(vertices_y)]
	];

	const hexAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
	const hexInitSize = { w: bounds[1][0] - bounds[0][0], h: bounds[1][1] - bounds[0][1] };

	// get width of first hex (which is the same as all others)
	const hexWidth = d3.max(hexes[0].vertices, (d) => d.x) - d3.min(hexes[0].vertices, (d) => d.x);

	// compute scale and translate (updated whenever width/height change)
	$: ({ s, t } = fitRect([hexInitSize.w, hexInitSize.h], [width, height]));

	// tooltip
	let tx, ty, content;
	function handleMouseover(event, item) {
		tx = event.layerX + 5;
		ty = event.layerY;
		content = item.n;
	}
	function handleMouseout(event) {
		// clear and hide outside of viewport
		tx = -100;
		ty = -100;
		content = '';
	}

	checkConditions = function (w, h) {
		// using constants: hexAR, hexInitSize, hexWidth
		const ar = w / h;
		const s = hexAR > w / h ? w / hexInitSize.w : h / hexInitSize.h;
		let c = [
			conditions.minHexSize ? hexWidth * s > conditions.minHexSize : true,
			conditions.maxAspectRatioDiff
				? ar / hexAR >= 1 / conditions.maxAspectRatioDiff &&
					ar / hexAR <= conditions.maxAspectRatioDiff
				: true
		];
		return c.every(Boolean);
	};
</script>

<!-- only display if this view state is selected -->
{#if display}
	<svg {width} {height}>
		<clipPath id="hex-clip-path">
			<polygon points={hexes[0].points} />
		</clipPath>

		<g
			id="hexmap"
			transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
		>
			{#each hexes as hex}
				<g transform="translate({hex.x},{hex.y})">
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<polygon
						class="hex"
						points={hex.points}
						stroke="#fff"
						stroke-width="2"
						fill={params.colorScale(results.find((x) => x.ons_id === hex.key).first_party)}
						clip-path="url(#hex-clip-path)"
						on:focus={(e) => handleMouseover(e, hex)}
						on:mouseover={(e) => handleMouseover(e, hex)}
						on:mouseout={handleMouseout}
						on:blur={handleMouseout}
					/>
				</g>
			{/each}
			<FillLegend
				colors={params.colors}
				labels={params.category_labels}
				title={params.title}
				x={hexInitSize.w + bounds[0][0] - 3}
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
{/if}

<style>
	polygon:hover {
		stroke: none;
	}
</style>
