<script>
	import { base } from '$app/paths';
	import { waitFor } from '$lib/helpers.js';

	let { params, context, display } = $props();

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const uid = $props.id();
	const div = `netpanorama-div-${uid}`;

	let height = $derived(context.height);
	let width = $derived(context.width);

	let svg = $state(); // will be assigned once defined below
	let g = $state();

	const spec = params.spec;

	$effect(() => {
		// render spec
		NetPanoramaTemplateViewer.render(spec, {}, div);
		// wait for svg and g to be ready and assign
		waitFor(() => document.querySelector('#' + div + ' svg.marks')).then(() => {
			svg = document.querySelector('#' + div + ' svg.marks');
			g = document.querySelector('#' + div + ' svg.marks > g');
		});
	});

	$effect(() => {
		if (svg && g && spec) {
			svg.style['max-width'] = null;
			svg.style['max-height'] = null;
			g.setAttribute(
				'transform',
				'translate(0,0) scale(' +
					Math.min(
						height / (spec.height + (spec.y ? spec.y : 0)),
						width / (spec.width + (spec.x ? spec.x : 0))
					) +
					')'
			);
		}
	});
</script>

<svelte:head>
	<script src="{base}/netpanorama-template-viewer/bundle.js"></script>
	<!-- importing via import in the script doesn't work because window is not defined at that point -->
</svelte:head>

<!-- N.B. The closing tags are necessary - making this div tag self-closing will cause errors -->
<!-- prettier-ignore -->
<div id={div} style='display: {display? 'block' : 'none'}' ></div>
