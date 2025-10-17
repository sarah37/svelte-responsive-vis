<script>
	import embed from 'vega-embed';

	let { height, width, spec } = $props();

	// unique div id
	const uid = $props.id();
	const div = `vegalite-div-${uid}`;

	$effect(() => {
		// container sizing in vega listens to the window resize event,
		// so we manually trigger this event here when the container size changes
		(height, width);
		window.dispatchEvent(new Event('resize'));
	});

	const options = { renderer: 'canvas', actions: false };

	let completeSpec = $derived({
		...spec,
		width: 'container',
		height: 'container'
	});

	$effect(() => {
		embed(`#${div}`, completeSpec, options).catch(console.error);
	});
</script>

<div id={div} style="height: {height}px; width: {width}px"></div>
