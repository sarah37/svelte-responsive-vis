<script module>
	// conditions -- only based on spec, does not require anything to be rendered

	function minAdjacencyMatrixLabelSize(min, spec) {
		const labelHeight = spec.height - (spec.y ? spec.y : 0);
		const nNodes = spec.data[0].values.length;
		const totalHeight = spec.height + (spec.y ? spec.y : 0);
		const totalWidth = spec.width + (spec.x ? spec.x : 0);

		return (w, h) => {
			const s = Math.min(h / totalHeight, w / totalWidth);
			return s * (labelHeight / nNodes) > min;
		};
	}

	function minArcDiagramLabelSize(min, spec) {
		const nNodes = spec.data[0].values.length;
		const totalHeight = spec.height + (spec.y ? spec.y : 0);
		const totalWidth = spec.width + (spec.x ? spec.x : 0);

		return (w, h) => {
			const s = Math.min(h / totalHeight, w / totalWidth);
			return s * (spec.height / nNodes) > min;
		};
	}

	export { minAdjacencyMatrixLabelSize, minArcDiagramLabelSize };
</script>

<script>
	import { resolve } from '$app/paths';

	let { spec, width, height } = $props();

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const uid = $props.id();
	const div = `netpanorama-div-${uid}`;

	let svg = $state(); // will be assigned once defined below
	let g = $state();

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

	function waitFor(conditionFunction) {
		const poll = (resolve) => {
			if (conditionFunction()) resolve();
			else setTimeout(() => poll(resolve), 400);
		};
		return new Promise(poll);
	}
</script>

<svelte:head>
	<script src={resolve('/netpanorama-template-viewer/bundle.js')}></script>
	<!-- importing via import in the script doesn't work because window is not defined at that point -->
</svelte:head>

<div id={div}></div>
