<script>
	import { range, schemeSet3 } from 'd3';
	import { onMount, tick } from 'svelte';

	export let views; // list of views - must be provided and contains data, parameters, constraint config for each view
	export let initSize = { w: 600, h: 400 },
		maxSize = { w: 1000, h: 700 },
		minSize = { w: 50, h: 50 };
	export let computeViewLandscape = true;
	export let width, height, viewLandscape; // can optionally be used on the page via bind:width={...}
	export let vlInterval = 1; // how detailed should the view landscape be calculated

	// color scheme for view landscape
	const vlColors = schemeSet3;

	// set up view switching / constraint checking
	const viewIDs = range(views.length); // list of view ids
	let checkConditions = Array(views.length).fill(() => true); // this gets replaced with the actual checkConditions functions below
	$: display = viewIDs.find((i) => checkConditions[i](width, height));

	// check if mounted (required for view landscape function)
	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	// check if mounted + and if view landscape should be computed manually
	// then recompute view landscape whenever the views are updated
	$: mounted && computeViewLandscape && updateViewLandscape(views);

	async function updateViewLandscape(views) {
		console.log('...updating view landscape');

		// make sure constraints + views are all done updating before recalculating
		await tick();

		let w = maxSize.w;
		let h = maxSize.h;

		console.log(w, h);
		// get an array of max width by max height that records which view is displayed at each size
		let arr = range(0, w, vlInterval).map((x) => {
			return range(0, h, vlInterval).map((y) => {
				for (let i = 0; i < views.length; i++) {
					if (checkConditions[i](x, y)) {
						return i;
					}
				}
			});
		});

		// draw this array on a canvas
		let canvas = document.createElement('canvas');
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);

		let c = canvas.getContext('2d');
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[0].length; y++) {
				c.fillStyle = typeof arr[x][y] == 'number' ? vlColors[arr[x][y]] : '#fff';
				c.fillRect(x * vlInterval, y * vlInterval, vlInterval, vlInterval);
			}
		}

		let dataURL = canvas.toDataURL();

		viewLandscape = { mode: 'dynamic', dataArray: arr, dataURL, size: [w, h] };
	}
</script>

<div id="outer-container">
	<div
		id="container"
		style="width:{initSize.w}px; height:{initSize.h}px; max-width:{maxSize.w}px; max-height:{maxSize.h}px; min-width:{minSize.w}px; min-height:{minSize.h}px"
		bind:offsetWidth={width}
		bind:offsetHeight={height}
	>
		{#each views as view, i}
			<svelte:component
				this={view.type}
				data={view.data}
				params={view.params}
				conditions={view.conditions}
				context={{
					width,
					height,
					views
				}}
				display={display === i}
				bind:checkConditions={checkConditions[i]}
			/>
		{/each}
	</div>
	<!-- slot for optional overlay -->
	<slot />
</div>

<style>
	#outer-container {
		position: relative;
	}
	#container {
		overflow: hidden;
		resize: both;
		position: relative;
		border: 1px solid #ccc;
		background-color: #fff;
	}
</style>
