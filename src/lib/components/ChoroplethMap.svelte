<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import * as d3 from 'd3';
	import * as topojson from 'topojson-client';

	import { fitRect, getAreaSize } from '$lib/helpers.js';
	import FillLegend from '$lib/components/FillLegend.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	$: height = context.height;
	$: width = context.width;

	const topo = data.map;
	const results = data.results;

	// prepare data: convert topojson to geojson (individual area polygons)
	const geo = topojson.feature(topo, topo.objects.merged); //params.collection
	// create mesh for drawing outlines
	const mesh = topojson.mesh(topo);

	// fit projection to container + geo data
	const initW = 500;
	const initH = 500;
	const projection = params.projection;
	projection.fitSize([initW, initH], mesh);
	const path = d3.geoPath(projection);

	// get bounds
	const bounds = path.bounds(mesh);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);

	const mapInitSize = { width: bounds[1][0] - bounds[0][0], height: bounds[1][1] - bounds[0][1] };

	// get area sizes
	geo.features.forEach((feature) => {
		feature.area = getAreaSize(feature, path);
		return feature;
	});

	// get smallest area
	let filterFunc =
		typeof conditions.minAreaFilter === 'function' ? conditions.minAreaFilter : (d) => true;
	const minArea = d3.min(geo.features.filter(filterFunc), (d) => d.area);

	// compute scale and translate
	$: ({ s, t } = fitRect([mapInitSize.width, mapInitSize.height], [width, height]));

	// Tooltip
	let tx, ty, content;
	function handleMouseover(event, item) {
		tx = event.layerX + 5;
		ty = event.layerY;
		content = item.properties.PCON13NM
			? item.properties.PCON13NM
			: toTitleCase(item.properties.PC_NAME);
	}
	function handleMouseout(event) {
		tx = -100;
		ty = -100;
		content = '';
	}
	// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript?noredirect=1&lq=1
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	checkConditions = function (w, h) {
		// using constants: mapAR, mapInitSize, minArea
		let ar = w / h; // aspect ratio of container
		let s = mapAR > w / h ? w / mapInitSize.width : h / mapInitSize.height;
		let c = [
			conditions.minAreaSize ? minArea * Math.pow(s, 2) > conditions.minAreaSize : true,
			conditions.maxAspectRatioDiff
				? ar / mapAR >= 1 / conditions.maxAspectRatioDiff &&
					ar / mapAR <= conditions.maxAspectRatioDiff
				: true
		];
		return c.every(Boolean);
	};
</script>

<!-- only display if this view state is selected -->
{#if display}
	<svg {width} {height}>
		<g
			id="choropleth"
			transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
		>
			<g id="polygons">
				{#each geo.features as feature}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<path
						class="area"
						id={params.map_id(feature)}
						d={path(feature)}
						fill={params.colorScale(
							results.find((x) => x.ons_id === feature.properties.id).first_party
						)}
						on:focus={(e) => handleMouseover(e, feature)}
						on:mouseover={(e) => handleMouseover(e, feature)}
						on:mouseout={handleMouseout}
						on:blur={handleMouseout}
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
				colors={params.colors}
				labels={params.category_labels}
				title={params.title}
				x={mapInitSize.width + bounds[0][0] - 3}
				y={0.15 * mapInitSize.height + bounds[0][1]}
				anchorX="right"
				s="0.69"
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
