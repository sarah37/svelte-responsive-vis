<script>
	import { base } from '$app/paths';
	import { waitFor } from '$lib/helpers.js';

	let { params, conditions, context, display, checkConditions = $bindable() } = $props();

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const uid = $props.id();
	const div = `netpanorama-div-${uid}`;

	let height = $derived(context.height);
	let width = $derived(context.width);

	let spec = $derived.by(() => {
		const spec = params.spec;
		spec.x = spec.x ? spec.x : 0;
		spec.y = spec.y ? spec.y : 0;
		return spec;
	});

	let svg = $state(); // will be assigned once defined below
	let g = $state();

	$effect(() => {
		// render spec
		NetPanoramaTemplateViewer.render(spec, {}, div);
		// wait for svg and g to be ready and assign
		waitFor((_) => document.querySelector('#' + div + ' svg.marks')).then((_) => {
			svg = document.querySelector('#' + div + ' svg.marks');
			g = document.querySelector('#' + div + ' svg.marks > g');
		});
	});

	$effect(() => {
		if (svg && g) {
			svg.style['max-width'] = null;
			svg.style['max-height'] = null;
			g.setAttribute(
				'transform',
				'translate(0,0) scale(' +
					Math.min(height / (spec.height + spec.y), width / (spec.width + spec.x)) +
					')'
			);
		}
	});

	// conditions -- only based on spec, does not require anything to be rendered
	let labelHeight = $derived(spec && spec.height - spec.y);
	let nNodes = $derived(spec.data[0].values.length);

	checkConditions = function (w, h) {
		let s = Math.min(h / (spec.height + spec.y), w / (spec.width + spec.x));
		let c = [
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true,
			conditions.minAdjacencyMatrixLabelSize
				? s * (labelHeight / nNodes) > conditions.minAdjacencyMatrixLabelSize
				: true,
			conditions.minArcDiagramLabelSize
				? s * (spec.height / nNodes) > conditions.minArcDiagramLabelSize
				: true
		];
		return c.every(Boolean);
	};
</script>

<svelte:head>
	<script src="{base}/netpanorama-template-viewer/bundle.js"></script>
	<!-- importing via import in the script doesn't work because window is not defined at that point -->
</svelte:head>

<!-- N.B. The closing tags are necessary - making this div tag self-closing will cause errors -->
<!-- prettier-ignore -->
<div id={div} style='display: {display? 'block' : 'none'}' ></div>
