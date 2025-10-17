<script>
	import { csvParse } from 'd3-dsv';
	import { geoAlbers } from 'd3-geo';
	import { scaleOrdinal } from 'd3-scale';
	import { feature } from 'topojson-client';

	import * as map from '$lib/data/uk-election/merged.json';
	import * as hex from '$lib/data/uk-election/test.hex.json';
	import resultsRaw from '$lib/data/uk-election/HoC-GE2019-results-by-constituency-csv.csv?raw';

	import ChoroplethMap from '$lib/vis/ChoroplethMap.svelte';
	import HexMap from '$lib/vis/HexMap.svelte';
	import WaffleChart from '$lib/vis/WaffleChart.svelte';

	import StatusBar from '$lib/ui/StatusBar.svelte';
	import { ResponsiveVis, View } from '$lib';
	import { maxAspectRatio } from '$lib/constraints/simple';
	import {
		maxAspectRatioDiff as maxAspectRatioDiffHex,
		minHexSize
	} from '$lib/constraints/hexMapConditions';
	import { maxAspectRatioDiff, minAreaSize } from '$lib/constraints/d3MapConditions';

	let width = $state();
	let height = $state();

	// parse csv from raw import
	const results = csvParse(resultsRaw);

	const categories = [
		'Con',
		'Lab',
		'SNP',
		'LD',
		'DUP',
		'SF',
		'PC',
		'SDLP',
		'Green',
		'Alliance',
		'Spk'
	];
	const colors = [
		'#0575c9',
		'#e91d0e',
		'#f8ed2e',
		'#efac18',
		'#b51c4b',
		'#159b78',
		'#13e594',
		'#224922',
		'#5fb25f',
		'#d6b429',
		'#d4cfbe'
	];
	const category_labels = [
		'Conservative',
		'Labour',
		'Scottish National Party',
		'Liberal Democrat',
		'Democratic Unionist Party',
		'Sinn Féin',
		'Plaid Cymru',
		'Social Democratic & Labour',
		'Green',
		'Alliance Party',
		'Speaker'
	];

	let colorScale = scaleOrdinal().domain(categories).range(colors);

	let arConditions = $state(false);

	let viewLandscape = $state(),
		landscapeOverlay = $state(false);
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | UK Election Map</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape>
	<!-- checkbox to disable/enable aspect ratio conditions -->
	<input type="checkbox" id="ar-conditions" bind:checked={arConditions} /><label for="ar-conditions"
		>Apply white space constraints</label
	>
</StatusBar>

<ResponsiveVis
	resizable
	initSize={{ w: 700, h: 700 }}
	maxSize={{ w: 1000, h: 700 }}
	minSize={{ w: 150, h: 150 }}
	bind:width
	bind:height
	computeViewLandscape
	bind:viewLandscape
	viewLandscapeOverlay={landscapeOverlay}
>
	<View
		conditions={[
			minAreaSize(2, geoAlbers().rotate([0, 0]), feature(map, map.objects.merged)),
			arConditions
				? maxAspectRatioDiff(2, geoAlbers().rotate([0, 0]), feature(map, map.objects.merged))
				: () => true
		]}
	>
		<ChoroplethMap
			{width}
			{height}
			data={{ map, results }}
			{colors}
			{category_labels}
			title="UK General Election 2019"
			projection={geoAlbers().rotate([0, 0])}
			map_id={(d) => d.properties.id}
			data_id={(d) => d.ons_id}
			{colorScale}
			values={(d) => d.first_party}
		/>
	</View>
	<View
		conditions={[minHexSize(5, hex), arConditions ? maxAspectRatioDiffHex(2, hex) : () => true]}
	>
		<HexMap
			{width}
			{height}
			data={{ hex, results }}
			{colors}
			{category_labels}
			title="UK General Election 2019"
			{colorScale}
		/>
	</View>
	<View conditions={[maxAspectRatio(1)]}>
		<WaffleChart {width} {height} data={results} {colorScale} orientation="vertical" />
	</View>
	<View>
		<WaffleChart {width} {height} data={results} {colorScale} orientation="horizontal" />
	</View>
</ResponsiveVis>
