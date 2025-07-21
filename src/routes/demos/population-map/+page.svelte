<script>
	import { geoEqualEarth, schemeTableau10, scaleOrdinal } from 'd3';

	import * as data from '$lib/data/world-population/world_with_continent.json';
	import * as data_americas from '$lib/data/world-population/subset_americas.json';

	import CircleMap from '$lib/components/CircleMap.svelte';
	import VegaLiteWrapper from '$lib/components/VegaLiteWrapper.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';

	let width, height;

	const datasets = {
		world: {
			label: 'World',
			data: data,
			barData: getBarData(data),
			projection: geoEqualEarth().rotate([-20, 0, 0]),
			maxCircle: 36,
			maxCircleDorling: 42
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
			maxCircle: 42,
			maxCircleDorling: 70
		}
	};
	const datasetsKeys = Object.keys(datasets);
	let selectedDataset = 'world';

	// colors for circles/bars colored by continent
	const continents = {
		world: [
			'North America',
			'Asia',
			'Oceania',
			'South America',
			'Europe',
			'Africa'
			// 'Antarctica'
		],
		americas: ['North America', 'South America']
	};
	const continent_colors = {
		world: schemeTableau10,
		americas: [schemeTableau10[0], schemeTableau10[3]]
	};

	$: circleColor = (d) =>
		scaleOrdinal().domain(continents[selectedDataset]).range(continent_colors[selectedDataset])(
			d.properties.continent
		);

	// configure circle legend
	const legend = {
		1000000: '1 million',
		100000000: '100 million',
		500000000: '500 million',
		1000000000: '1 billion'
	};
	const legendTickFormat = (d) => legend[d];
	const legendTickValues = Object.keys(legend);

	// prep data for bar chart
	function getBarData(geojson) {
		return {
			default: geojson.features
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
				})
		};
	}

	// abbreviate some long country names to limit the space required for axes
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

	// Vega Lite spec for bar charts (vertical + horizontal)
	$: vl_barchart_vertical = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: { values: getBarData(datasets[selectedDataset].data).default },
		height: { step: 17 },
		mark: 'bar',
		encoding: {
			x: {
				field: 'adm',
				type: 'ordinal',
				sort: '-y',
				axis: {
					labelAngle: -45,
					title: 'Country'
				}
			},
			y: {
				field: 'pop',
				type: 'quantitative',
				axis: {
					format: '.2s',
					title: 'Population'
				}
			},
			color: {
				field: 'continent',
				scale: { range: continent_colors[selectedDataset], domain: continents[selectedDataset] },
				legend: { orient: 'top-right', title: null, offset: 5 }
			}
		}
	};
	$: vl_barchart_horizontal = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: { values: getBarData(datasets[selectedDataset].data).default },
		height: { step: 17 },
		mark: 'bar',
		encoding: {
			x: {
				field: 'pop',
				type: 'quantitative',
				axis: {
					format: '.2s',
					title: 'Population'
				}
			},
			y: {
				field: 'adm',
				type: 'ordinal',
				sort: '-x',
				axis: {
					labelAngle: 0,
					title: 'Country'
				}
			},
			color: {
				field: 'continent',
				scale: { range: continent_colors[selectedDataset], domain: continents[selectedDataset] },
				legend: { orient: 'bottom-right', title: null, offset: 5 }
			}
		}
	};

	let arConditions = false;

	$: views = [
		{
			type: CircleMap, // configured as proportional circle map
			data: datasets[selectedDataset].data,
			params: {
				projection: datasets[selectedDataset].projection,
				bounds: datasets[selectedDataset].bounds,
				circleColor: circleColor,
				legendTickValues: legendTickValues,
				legendTickFormat: legendTickFormat,
				maxCircle: datasets[selectedDataset].maxCircle
			},
			conditions: {
				minCircleRadius: 1,
				maxAspectRatioDiff: arConditions ? 1.5 : false
			}
		},
		{
			type: CircleMap, // configured as Dorling
			data: datasets[selectedDataset].data,
			params: {
				dorling: true,
				projection: datasets[selectedDataset].projection,
				circleColor: circleColor,
				legendTickValues: legendTickValues,
				legendTickFormat: legendTickFormat,
				maxCircle: datasets[selectedDataset].maxCircleDorling
			},
			conditions: {
				minCircleRadius: 1,
				maxAspectRatioDiff: arConditions ? 1.5 : false
			}
		},
		{
			type: VegaLiteWrapper,
			data: getBarData(datasets[selectedDataset].data),
			params: {
				spec: vl_barchart_vertical,
				filter: (w, h) => {
					return `datum.i < ${(w - 20) / 20}`;
				}
			},
			conditions: {
				minAspectRatio: 1 // landscape format
			}
		},
		{
			type: VegaLiteWrapper,
			data: getBarData(datasets[selectedDataset].data),
			params: {
				spec: vl_barchart_horizontal,
				filter: (w, h) => {
					return `datum.i < ${(h - 20) / 20}`;
				}
			},
			conditions: {}
		}
	];

	let viewLandscape, landscapeOverlay;
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Population Map</title>
</svelte:head>

<!-- <slot /> -->
<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape>
	Select dataset:
	<select bind:value={selectedDataset}>
		{#each datasetsKeys as dataset}
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
	{views}
	initSize={{ w: 1000, h: 600 }}
	maxSize={{ w: 1000, h: 700 }}
	minSize={{ w: 200, h: 200 }}
	bind:width
	bind:height
	bind:viewLandscape
>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
