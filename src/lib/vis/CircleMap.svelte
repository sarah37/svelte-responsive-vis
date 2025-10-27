<script>
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

	import { getMapSetup, getMapScaleTranslate, getRadiusScale } from './d3MapHelpers.js';
	import Tooltip from './Tooltip.svelte';
	import CircleLegend from './CircleLegend.svelte';

	let { data, projection, maxCircle, circleColor, dorling = false, width, height } = $props();

	let map = $state(),
		circles = $state();

	let { path, bounds, mapAR, mapInitSize } = $derived(getMapSetup(data, projection));

	// circle radius (slightly bigger for Dorling)
	let r = $derived(getRadiusScale(data, maxCircle));

	// configure circle legend
	const legend = {
		1000000: '1 million',
		100000000: '100 million',
		500000000: '500 million',
		1000000000: '1 billion'
	};
	const legendTickFormat = (d) => legend[d];
	const legendTickValues = Object.keys(legend);

	$effect(() => {
		if (dorling) {
			// get Dorling cartogram positions
			// adds/updates d.x and d.y
			let dorlingSimulation = forceSimulation(data.features)
				.force(
					'x',
					forceX((d) => projection(d.properties.centroid)[0])
				)
				.force(
					'y',
					forceY((d) => projection(d.properties.centroid)[1])
				)
				.force(
					'collide',
					forceCollide((d) => r(d.properties.POP_EST))
				)
				.stop();
			dorlingSimulation.tick(200);
			data.features.forEach(function (d) {
				d.properties.dorlingX = d.x;
				d.properties.dorlingY = d.y;
			});
		}
	});

	// compute scale + translate so that map is always at max size, centered within the container
	let { s, t } = $derived(getMapScaleTranslate(width, height, mapAR, mapInitSize));

	// Tooltip
	let x = $state(),
		y = $state(),
		content = $state();
	function handleMouseover(event, feature) {
		x = dorling ? feature.properties.dorlingX : projection(feature.properties.centroid)[0];
		y = dorling ? feature.properties.dorlingY : projection(feature.properties.centroid)[1];
		content = feature.properties.ADMIN;
	}
	function handleMouseout() {
		x = -100;
		y = -100;
		content = '';
	}
</script>

<svg {width} {height}>
	<g transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})">
		<!-- transform to make map + circles align with top left corner; will be centered in adapt function -->
		<g id="map" bind:this={map}>
			{#each data.features as feature (feature)}
				<path
					class="country"
					id={feature.properties.ISO_A3}
					d={path(feature)}
					fill="#f5f5f5"
					stroke="#e0e0e0"
					stroke-width="{0.7 / s}px"
				/>
			{/each}
		</g>
		<g id="circles" bind:this={circles}>
			{#each data.features as feature (feature)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<circle
					r={r(feature.properties.POP_EST)}
					cx={dorling ? feature.properties.dorlingX : projection(feature.properties.centroid)[0]}
					cy={dorling ? feature.properties.dorlingY : projection(feature.properties.centroid)[1]}
					fill={circleColor(feature)}
					stroke={circleColor(feature)}
					fill-opacity="0.4"
					stroke-width="{1 / s}px"
					onfocus={(e) => handleMouseover(e, feature)}
					onmouseover={(e) => handleMouseover(e, feature)}
					onmouseout={handleMouseout}
					onblur={handleMouseout}
				/>
			{/each}
		</g>
		<CircleLegend
			x={5 + bounds[0][0]}
			y={mapInitSize[1] + bounds[0][1] - 5}
			anchorX="left"
			anchorY="bottom"
			scale={r}
			tickValues={legendTickValues}
			tickFormat={legendTickFormat}
			{s}
		/>
		<Tooltip bind:x bind:y bind:content fontSize={12 / s} />
	</g></svg
>

<style>
	circle:hover {
		fill-opacity: 0.8;
	}
</style>
