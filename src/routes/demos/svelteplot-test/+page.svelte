<script>
	import * as movies from '$lib/data/movies/movies.json';

	import { Plot, Rect, Dot, bin } from 'svelteplot';

	import { ResponsiveVis, View } from 'svelte-responsive-vis';
	import { minWidth } from 'svelte-responsive-vis/constraints';

	let movies_binned = $derived(
		bin({ data: movies.default, x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' }, { fill: 'count' })
	);

	// need to manually pass this to SveltePlot because it ignores container height by default
	let height = $state();

	let showOverlay = $state(false);
</script>

<label><input type="checkbox" bind:checked={showOverlay} />Show view landscape overlay</label>

<ResponsiveVis resizable computeViewLandscape viewLandscapeOverlay={showOverlay} bind:height>
	<View conditions={[minWidth(300)]}>
		<Plot grid {height}>
			<Dot data={movies.default} x="IMDB Rating" y="Rotten Tomatoes Rating" stroke="#000" />
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
