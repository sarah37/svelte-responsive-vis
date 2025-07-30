<script>
	import {
		geoPath,
		scaleSqrt,
		max as d3max,
		forceSimulation,
		forceX,
		forceY,
		forceCollide
	} from 'd3';

	import Tooltip from '$lib/components/vis/Tooltip.svelte';
	import CircleLegend from '$lib/components/vis/CircleLegend.svelte';

	let { data, params, conditions, context, display, checkConditions = $bindable() } = $props();

	let map = $state(),
		circles = $state();

	// arbitrary size for svg viewbox
	const initW = 500,
		initH = 500;

	let height = $derived(context.height);
	let width = $derived(context.width);

	// fit projection to container + geo data
	let projection = $derived(params.projection.fitSize([initW, initH], data));
	let path = $derived(geoPath(projection));
	let bounds = $derived(path.bounds(data));
	let mapAR = $derived((bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]));
	let mapInitSize = $derived(
		initW / initH < mapAR
			? { width: initW, height: initW / mapAR }
			: { width: initH * mapAR, height: initH }
	);
	// circle radius (slightly bigger for Dorling)
	let r = $derived(
		scaleSqrt()
			.domain([0, d3max(data.features, (d) => d.properties.POP_EST)])
			.range([0, params.maxCircle])
	);

	$effect(() => {
		if (params.dorling) {
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
	let s = $derived(
		mapAR > width / height ? width / mapInitSize.width : height / mapInitSize.height
	);
	let t = $derived(
		mapAR < width / height
			? [(width - s * mapInitSize.width) / 2, 0]
			: [0, (height - s * mapInitSize.height) / 2]
	);

	// Tooltip
	let x = $state(),
		y = $state(),
		content = $state();
	function handleMouseover(event, feature) {
		x = params.dorling ? feature.properties.dorlingX : projection(feature.properties.centroid)[0];
		y = params.dorling ? feature.properties.dorlingY : projection(feature.properties.centroid)[1];
		content = feature.properties.ADMIN;
	}
	function handleMouseout(event) {
		x = -100;
		y = -100;
		content = '';
	}

	// calculate some things for conditions
	let pop_vals = $derived(data.features.map((d) => d.properties.POP_EST));
	let lower_bound = $derived(pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)]);

	checkConditions = function (w, h) {
		let s = mapAR > w / h ? w / mapInitSize.width : h / mapInitSize.height;
		let c = [
			conditions.minCircleRadius ? r(lower_bound) * s > conditions.minCircleRadius : true, // min r - at least 90% of circles visible
			conditions.maxAspectRatioDiff
				? (w / h / mapAR >= 1 / conditions.maxAspectRatioDiff, // aspect ratio difference - no more than 1/3 white space
					w / h / mapAR <= conditions.maxAspectRatioDiff)
				: true
		];
		return c.every(Boolean);
	};
</script>

<!-- only display if this view state is selected -->
{#if display}
	<svg {width} {height}>
		<g transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})">
			<!-- transform to make map + circles align with top left corner; will be centered in adapt function -->
			<g id="map" bind:this={map}>
				{#each data.features as feature}
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
				{#each data.features as feature}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<circle
						r={r(feature.properties.POP_EST)}
						cx={params.dorling
							? feature.properties.dorlingX
							: projection(feature.properties.centroid)[0]}
						cy={params.dorling
							? feature.properties.dorlingY
							: projection(feature.properties.centroid)[1]}
						fill={params.circleColor(feature)}
						stroke={params.circleColor(feature)}
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
				y={mapInitSize.height + bounds[0][1] - 5}
				anchorX="left"
				anchorY="bottom"
				scale={r}
				tickValues={params.legendTickValues}
				tickFormat={params.legendTickFormat}
				{s}
			/>
			<Tooltip bind:x bind:y bind:content fontSize={12 / s} />
		</g></svg
	>
{/if}

<style>
	circle:hover {
		fill-opacity: 0.8;
	}
</style>
