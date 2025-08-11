<script>
	import { fitRect } from '$lib/components/vis/d3MapHelpers.js';
	import FillLegend from '$lib/components/vis/FillLegend.svelte';
	import Tooltip from '$lib/components/vis/Tooltip.svelte';
	import { createHexMap } from '$lib/components/vis/hexMapPrep.js';
	let { data, params, conditions, context, display } = $props();

	let height = $derived(context.height);
	let width = $derived(context.width);

	const hex = data.hex;
	const results = data.results;

	const { hexes, bounds, hexAR, hexInitSize, hexWidth } = createHexMap(hex);

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
	function handleMouseout(event) {
		// clear and hide outside of viewport
		tx = -100;
		ty = -100;
		content = '';
	}
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
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<polygon
						class="hex"
						points={hex.points}
						stroke="#fff"
						stroke-width="2"
						fill={params.colorScale(results.find((x) => x.ons_id === hex.key).first_party)}
						clip-path="url(#hex-clip-path)"
						onfocus={(e) => handleMouseover(e, hex)}
						onmouseover={(e) => handleMouseover(e, hex)}
						onmouseout={handleMouseout}
						onblur={handleMouseout}
					/>
				</g>
			{/each}
			<FillLegend
				colors={params.colors}
				labels={params.category_labels}
				title={params.title}
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
{/if}

<style>
	polygon:hover {
		stroke: none;
	}
</style>
