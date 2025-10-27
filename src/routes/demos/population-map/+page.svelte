<script>
	import * as data from '$lib/data/world-population/world_with_continent.json';
	import * as data_americas from '$lib/data/world-population/subset_americas.json';

	import { ResponsiveVis, View } from 'svelte-responsive-vis';
	import { minAspectRatio, maxAspectRatioDiff } from 'svelte-responsive-vis/constraints';

	import StatusBar from '$lib/ui/StatusBar.svelte';

	import { default as CircleMap, minCircleRadius } from '$lib/vis/CircleMap.svelte';

	import { geoEqualEarth } from 'd3-geo';
	import { schemeTableau10 } from 'd3-scale-chromatic';
	import { scaleOrdinal } from 'd3-scale';
	import { Plot, BarX, BarY } from 'svelteplot';

	let width = $state(),
		height = $state();

	const datasets = {
		world: {
			label: 'World',
			data: data,
			barData: getBarData(data),
			projection: geoEqualEarth().rotate([-20, 0, 0]),
			maxCircle: 64,
			maxCircleDorling: 74
		},
		// europe: {
		// 	label: 'Europe',
		// 	data: data_europe,
		// 	barData: getBarData(data_europe),
		// 	projection: geoBonne().rotate([-20.0, 0.0]).center([0.0, 52.0]).parallel(52),
		// 	geobounds: [[], []]
		// },
		americas: {
			label: 'North & South America',
			data: data_americas,
			barData: getBarData(data_americas),
			projection: geoEqualEarth().rotate([90, 0]),
			maxCircle: 35,
			maxCircleDorling: 58
		}
	};
	const datasetsKeys = Object.keys(datasets);
	let selectedDataset = $state('world');

	// checkbox to toggle aspect ratio conditions
	let arConditions = $state(false);

	const colorScale = {
		domain: [
			'North America',
			'Asia',
			'Oceania',
			'South America',
			'Europe',
			'Africa'
			// 'Antarctica'
		],
		scheme: schemeTableau10
	};

	const circleColor = (d) =>
		scaleOrdinal().domain(colorScale.domain).range(colorScale.scheme)(d.properties.continent);

	// prep data for bar chart
	function getBarData(geojson) {
		return geojson.features
			.map((d) => {
				return {
					adm: replace(d.properties.ADMIN),
					pop: d.properties.POP_EST,
					continent: d.properties.continent
				};
			})
			.sort((a, b) => b.pop - a.pop) // sort by population (descending order)
			.map((d, i) => {
				return { ...d, i }; // add index (for filtering most populous countries)
			});
	}

	// bar chart - abbreviate some long country names to limit the space required for axes
	function replace(adm) {
		switch (adm) {
			case 'United States of America':
				return 'USA';
			case 'United Republic of Tanzania':
				return 'Tanzania';
			case 'Democratic Republic of the Congo':
				return 'DR Congo';
			default:
				return adm;
		}
	}

	const barData = $derived(getBarData(datasets[selectedDataset].data));

	let viewLandscape = $state(),
		landscapeOverlay = $state();
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Population Map</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape>
	Select dataset:
	<select bind:value={selectedDataset}>
		{#each datasetsKeys as dataset (dataset)}
			<option value={dataset}>
				{datasets[dataset].label}
			</option>
		{/each}
	</select><br />
	<input type="checkbox" id="ar-conditions" bind:checked={arConditions} /><label for="ar-conditions"
		>Apply white space constraints</label
	>
</StatusBar>

<ResponsiveVis
	resizable
	initSize={{ w: 1000, h: 600 }}
	maxSize={{ w: 1000, h: 700 }}
	minSize={{ w: 200, h: 200 }}
	bind:width
	bind:height
	computeViewLandscape
	viewLandscapeOverlay={landscapeOverlay}
	bind:viewLandscape
>
	<View
		{width}
		{height}
		conditions={[
			minCircleRadius(
				1,
				datasets[selectedDataset].maxCircle,
				datasets[selectedDataset].projection,
				datasets[selectedDataset].data
			),
			arConditions
				? maxAspectRatioDiff(
						1.5,
						datasets[selectedDataset].projection,
						datasets[selectedDataset].data
					)
				: () => true
		]}
	>
		<CircleMap
			{width}
			{height}
			data={datasets[selectedDataset].data}
			projection={datasets[selectedDataset].projection}
			bounds={datasets[selectedDataset].bounds}
			{circleColor}
			maxCircle={datasets[selectedDataset].maxCircle}
		/>
	</View>
	<View
		conditions={[
			minCircleRadius(
				1,
				datasets[selectedDataset].maxCircleDorling,
				datasets[selectedDataset].projection,
				datasets[selectedDataset].data
			),
			arConditions
				? maxAspectRatioDiff(
						1.5,
						datasets[selectedDataset].projection,
						datasets[selectedDataset].data
					)
				: () => true
		]}
	>
		<CircleMap
			{width}
			{height}
			data={datasets[selectedDataset].data}
			dorling
			projection={datasets[selectedDataset].projection}
			{circleColor}
			maxCircle={datasets[selectedDataset].maxCircleDorling}
		/>
	</View>
	<View conditions={[minAspectRatio(1)]}>
		<Plot
			{height}
			x={{ tickRotate: -45, label: false }}
			y={{ label: 'Population ↑' }}
			color={colorScale}
		>
			<BarY
				data={barData.filter((d) => d.i < (width - 20) / 20)}
				y="pop"
				x="adm"
				fill="continent"
				sort={{ channel: '-y' }}
			/>
		</Plot>
	</View>
	<View>
		<Plot {height} x={{ label: 'Population →' }} y={{ label: false }} color={colorScale}>
			<BarX
				data={barData.filter((d) => d.i < (height - 20) / 20)}
				x="pop"
				y="adm"
				fill="continent"
				sort={{ channel: '-x' }}
			/>
		</Plot>
	</View>
</ResponsiveVis>
