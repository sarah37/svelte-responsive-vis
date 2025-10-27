<script>
	import * as movies from '$lib/data/movies/movies.json';

	import { Plot, Rect, Dot, bin } from 'svelteplot';

	import { ResponsiveVis, View } from 'svelte-responsive-vis';
	import { maxOverplotting } from 'svelte-responsive-vis/constraints';

	// prepare data for the binned heatmap
	let movies_binned = $derived(
		bin({ data: movies.default, x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' }, { fill: 'count' })
	);

	// need to manually pass this to SveltePlot because it ignores container height by default
	let height = $state();

	let showOverlay = $state(false);

	const scatter_radius = 3;

	// prepare data for the overlap condition
	const ratings = movies.default
		.map((d) => {
			return [d['IMDB Rating'], d['Rotten Tomatoes Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null

	// required for overlap condition
	const marginX = 0; // left + right margin
	const marginY = 0; // top + bottom margin

	// manually set these so the plot shows the entire range of possible ratings
	const xDomain = [0, 10];
	const yDomain = [0, 100];
</script>

<label><input type="checkbox" bind:checked={showOverlay} />Show view landscape overlay</label>

<ResponsiveVis
	resizable
	computeViewLandscape
	viewLandscapeInterval="25"
	viewLandscapeOverlay={showOverlay}
	bind:height
>
	<View
		conditions={[
			maxOverplotting(0.0012, ratings, scatter_radius, marginX, marginY, xDomain, yDomain)
		]}
	>
		<Plot grid {height} x={{ domain: xDomain }} y={{ domain: yDomain }}>
			<Dot
				r={scatter_radius}
				data={movies.default}
				x="IMDB Rating"
				y="Rotten Tomatoes Rating"
				stroke="#0006"
			/>
		</Plot>
	</View>
	<View>
		<Plot color={{ scheme: 'YlGnBu' }} {height}>
			<Rect
				{...bin(
					{ data: movies.default, x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
					{ fill: 'count' }
				)}
			/>
		</Plot>
	</View>
</ResponsiveVis>
