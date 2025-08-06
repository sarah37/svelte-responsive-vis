<script>
	import embed from 'vega-embed';

	import maxOverplotting from '$lib/constraints/maxOverplotting';

	let { data, params, conditions, context, display, checkConditions = $bindable() } = $props();

	// these seem to be the same for every plot
	const margin = {
		top: 10,
		bottom: 35,
		left: 45,
		right: 3
	};
	// unique div id
	const uid = $props.id();
	const div = `vegalite-div-${uid}`;

	// size of container
	let height = $derived(context.height);
	let width = $derived(context.width);

	$effect(() => {
		// container sizing in vega listens to the window resize event,
		// so we manually trigger this event here when the container size changes
		(height, width);
		window.dispatchEvent(new Event('resize'));
	});

	const options = { renderer: 'canvas', actions: false };

	let spec = $derived({
		...params.spec,
		width: 'container',
		height: 'container',
		...(typeof params.filter === 'function' && {
			transform: [{ filter: params.filter(width, height) }]
		})
	});

	$effect(() => {
		embed('#' + div, spec, options).catch(console.error);
	});

	// CONDITIONS
	// compute overplotting
	const ratings = data.default
		.map((d) => {
			return [d['IMDB Rating'], d['Rotten Tomatoes Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null

	const radius = 3.09; // default size of vega-lite circle is 30, i.e. radius of 3.09

	checkConditions = function (w, h) {
		let c = [
			conditions.maxOverplotting
				? maxOverplotting(ratings, radius, w, h) < conditions.maxOverplotting
				: true,
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true
		];
		return c.every(Boolean);
	};
</script>

<div
	id={div}
	style="display: {display
		? 'block'
		: 'none'}; height: {context.height}px; width: {context.width}px"
></div>
