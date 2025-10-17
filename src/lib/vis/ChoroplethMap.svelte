<script>
	import * as topojson from 'topojson-client';

	import FillLegend from '$lib/vis/FillLegend.svelte';
	import Tooltip from '$lib/vis/Tooltip.svelte';

	import { getMapSetup, fitRect } from './d3MapHelpers';

	let { data, width, height, projection, map_id, colorScale, colors, category_labels, title } =
		$props();

	const topo = data.map;
	const results = data.results;

	// prepare data: convert topojson to geojson (individual area polygons)
	const geo = topojson.feature(topo, topo.objects.merged);
	// create mesh for drawing outlines
	const mesh = topojson.mesh(topo);

	// map projection + measurements
	const { path, bounds, mapInitSize } = getMapSetup(mesh, projection);

	// compute scale and translate
	let { s, t } = $derived(fitRect(mapInitSize, [width, height]));

	// Tooltip
	let tx = $state(),
		ty = $state(),
		content = $state();
	function handleMouseover(event, item) {
		tx = event.layerX + 5;
		ty = event.layerY;
		content = item.properties.PCON13NM
			? item.properties.PCON13NM
			: toTitleCase(item.properties.PC_NAME);
	}
	function handleMouseout() {
		tx = -100;
		ty = -100;
		content = '';
	}
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
</script>

<svg {width} {height}>
	<g
		id="choropleth"
		transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
	>
		<g id="polygons">
			{#each geo.features as feature (feature)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<path
					class="area"
					id={map_id(feature)}
					d={path(feature)}
					fill={colorScale(results.find((x) => x.ons_id === feature.properties.id).first_party)}
					onfocus={(e) => handleMouseover(e, feature)}
					onmouseover={(e) => handleMouseover(e, feature)}
					onmouseout={handleMouseout}
					onblur={handleMouseout}
				/>
			{/each}
		</g>
		<g id="mesh" pointer-events="none">
			<path
				class="mapMesh"
				d={path(mesh)}
				fill="transparent"
				stroke="#fff"
				stroke-width="{0.5 / s}px"
			/>
		</g>
		<FillLegend
			{colors}
			labels={category_labels}
			{title}
			x={mapInitSize[0] + bounds[0][0]}
			y={0.15 * mapInitSize[1] + bounds[0][1]}
			anchorX="right"
			s="0.25"
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
