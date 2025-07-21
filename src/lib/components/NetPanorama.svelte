<script context="module">
	// netpanorama needs a div id to render the network vis into
	// this generates a unique id if this Svelte component is used multiple times on the same page
	// id's will not be reused and keep going up if components are mounted/destroyed repeatedly
	let i = 0;
	const id = function () {
		let name = 'netpanorama-div-' + i;
		i += 1;
		return name;
	};
</script>

<script>
	// export let data
	export let params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import { onMount, tick } from 'svelte';
	import { base } from '$app/paths';
	import { waitFor } from '$lib/helpers.js';

	$: height = context.height;
	$: width = context.width;
	$: display;

	$: spec = params.spec;
	$: spec.x = spec.x ? spec.x : 0;
	$: spec.y = spec.y ? spec.y : 0;

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const div = id();

	// hacky way to make the sizing work
	let svg, g;
	$: svg && (svg.style['max-width'] = null);
	$: svg && (svg.style['max-height'] = null);
	$: g &&
		g.setAttribute(
			'transform',
			'translate(0,0) scale(' +
				Math.min(height / (spec.height + spec.y), width / (spec.width + spec.x)) +
				')'
		);

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
	$: if (mounted) {
		NetPanoramaTemplateViewer.render(spec, {}, div);

		scaleVis(spec);
	}
	// let viewer;

	async function scaleVis(spec) {
		// viewer = await NetPanoramaTemplateViewer.render(spec, {}, div);
		// console.log(viewer);
		// window.viewer = viewer;

		// hacky way to make the sizing work
		await tick(); // wait for it to render the update
		waitFor((_) => document.querySelector('#' + div + ' svg.marks')).then((_) => {
			svg = document.querySelector('#' + div + ' svg.marks');
			g = document.querySelector('#' + div + ' svg.marks > g');
		});
	}

	// conditions -- only based on spec, does not require anything to be rendered
	$: labelHeight = spec && spec.height - spec.y;
	$: nNodes = spec.data[0].values.length;

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
