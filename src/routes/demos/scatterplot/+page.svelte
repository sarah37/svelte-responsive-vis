<script>
	import { ResponsiveVis, View } from 'svelte-responsive-vis';
	import { maxOverplotting } from 'svelte-responsive-vis/constraints';

	import VegaLiteWrapper from '$lib/vis/VegaLiteWrapper.svelte';
	import StatusBar from '$lib/ui/StatusBar.svelte';

	import * as data from '$lib/data/movies/movies.json';

	let width = $state(),
		height = $state();

	let viewLandscape = $state();
	let landscapeOverlay = $state(false);

	const ratings = data.default
		.map((d) => {
			return [d['IMDB Rating'], d['Rotten Tomatoes Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null

	const radius = 3.09; // default size of vega-lite circle is 30, i.e. radius of 3.09

	const vl_spec_scatterplot = {
		$schema: 'https://vega.github.io/schema/vega-lite/v6.json',
		data: {
			values: data.default
		},
		mark: 'point',
		encoding: {
			x: { field: 'IMDB Rating', type: 'quantitative' },
			y: { field: 'Rotten Tomatoes Rating', type: 'quantitative' }
		}
	};

	const vl_spec_histogram_heatmap = {
		$schema: 'https://vega.github.io/schema/vega-lite/v6.json',
		data: {
			values: data.default
		},
		mark: 'rect',
		encoding: {
			x: {
				bin: { maxbins: 60 },
				field: 'IMDB Rating',
				type: 'quantitative',
				axis: { title: 'IMDB Rating' }
			},
			y: {
				bin: { maxbins: 40 },
				field: 'Rotten Tomatoes Rating',
				type: 'quantitative',
				axis: { title: 'Rotten Tomatoes Rating' }
			},
			color: {
				aggregate: 'count',
				type: 'quantitative',
				legend: { orient: 'top-left', direction: 'vertical', gradientLength: 100 }
			}
		},
		config: {
			view: {
				stroke: 'transparent'
			}
		}
	};
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Movies Scatterplot</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis
	resizable
	minSize={{ w: 200, h: 200 }}
	maxSize={{ w: 1000, h: 800 }}
	initSize={{ w: 800, h: 600 }}
	bind:width
	bind:height
	computeViewLandscape
	viewLandscapeOverlay={landscapeOverlay}
	viewLandscapeInterval={50}
	bind:viewLandscape
>
	<View conditions={[maxOverplotting(0.0012, ratings, radius)]}>
		<VegaLiteWrapper spec={vl_spec_scatterplot} {height} {width} />
	</View>
	<View>
		<VegaLiteWrapper spec={vl_spec_histogram_heatmap} {height} {width} />
	</View>
</ResponsiveVis>
