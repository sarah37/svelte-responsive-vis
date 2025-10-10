<script>
	import embed from 'vega-embed';

	let { params, context, display } = $props();

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
</script>

<div
	id={div}
	style="display: {display
		? 'block'
		: 'none'}; height: {context.height}px; width: {context.width}px"
></div>
