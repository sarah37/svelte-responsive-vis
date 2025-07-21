<script>
	import * as d3 from 'd3';

	import * as map from '$lib/data/uk-election/merged.json';
	import * as hex from '$lib/data/uk-election/test.hex.json';
	import { default as results } from '$lib/data/uk-election/HoC-GE2019-results-by-constituency-csv.csv';

	import ChoroplethMap from '$lib/components/ChoroplethMap.svelte';
	import HexMap from '$lib/components/HexMap.svelte';
	import WaffleChart from '$lib/components/WaffleChart.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

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

	let colorScale = d3.scaleOrdinal().domain(categories).range(colors);

	let arConditions = false;

	$: views = [
		{
			type: ChoroplethMap,
			data: { map, results },
			params: {
				colors: colors,
				category_labels: category_labels,
				title: 'UK General Election 2019',
				projection: d3.geoAlbers().rotate([0, 0]),
				map_id: (d) => d.properties.id,
				data_id: (d) => d.ons_id,
				colorScale: colorScale,
				values: (d) => d.first_party
			},
			conditions: {
				minAreaSize: 2,
				maxAspectRatioDiff: arConditions ? 2 : false
			}
		},
		{
			type: HexMap,
			data: { hex, results },
			params: {
				colors: colors,
				category_labels: category_labels,
				title: 'UK General Election 2019',
				colorScale: colorScale
			},
			conditions: {
				minHexSize: 5,
				maxAspectRatioDiff: arConditions ? 2 : false
			}
		},
		{
			type: WaffleChart,
			data: { results },
			params: { colorScale, orientation: 'vertical' },
			conditions: { maxAspectRatio: 1 }
		},
		{
			type: WaffleChart,
			data: { results },
			params: { colorScale, orientation: 'horizontal' },
			conditions: {}
		}
	];

	let viewLandscape,
		landscapeOverlay = false;
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
	{views}
	initSize={{ w: 700, h: 700 }}
	maxSize={{ w: 1000, h: 700 }}
	minSize={{ w: 150, h: 150 }}
	bind:width
	bind:height
	bind:viewLandscape
>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
