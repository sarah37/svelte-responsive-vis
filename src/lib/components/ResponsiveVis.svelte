<script>
	import { range, schemeSet3 } from 'd3';
	import { onMount, tick } from 'svelte';

	import Worker from './worker_view_landscape.js?worker';

	let {
		views, // list of views - must be provided and contains data, parameters, constraint config for each view
		initSize = { w: 600, h: 400 },
		maxSize = { w: 1000, h: 700 },
		minSize = { w: 50, h: 50 },
		computeViewLandscape = true,
		width = $bindable(),
		height = $bindable(),
		viewLandscape = $bindable(), // ^ these are bindable to they can be used on the page (optionally)
		vlInterval = 1, // how detailed should the view landscape be calculated
		children
	} = $props();

	// color scheme for view landscape
	const vlColors = schemeSet3;

	// set up view switching / constraint checking
	const viewIDs = range(views.length); // list of view ids
	let checkConditions = $state(Array(views.length).fill(() => true)); // this gets replaced with the actual checkConditions functions below
	let display = $derived.by(() => {
		// const startTime = performance.now();
		let result = viewIDs.find((i) => checkConditions[i](width, height));
		// const endTime = performance.now();
		// console.log(`Checked conditions in ${endTime - startTime} ms`);
		return result;
	});

	// check if mounted (required for view landscape function)
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	async function updateViewLandscape(views) {
		console.log('...updating view landscape');
		const startTime = performance.now();

		let result = $state();
		const worker = new Worker();

		worker.onmessage = (event) => {
			viewLandscape = event.data;
		};

		// make sure constraints + views are all done updating before recalculating
		await tick();

		const w = maxSize.w;
		const h = maxSize.h;
		const w_interval = Math.floor(w / vlInterval);
		const h_interval = Math.floor(w / vlInterval);

		// array of max width by max height that records which view is displayed at each size
		let arr = new Array(w_interval);

		for (let x = 0; x < arr.length; x++) {
			arr[x] = new Array(h_interval);
			for (let y = 0; y < arr.length; y++) {
				for (let i = 0; i < views.length; i++) {
					if (checkConditions[i](x * vlInterval + 1, y * vlInterval + 1)) {
						arr[x][y] = i;
						break;
					}
				}
			}
		}

		let vl_obj = {
			mode: 'dynamic',
			dataArray: arr,
			size: [w, h],
			interval: vlInterval,
			colors: vlColors
		};

		worker.postMessage(vl_obj);

		const endTime = performance.now();
		console.log(`Computed view landscape in ${endTime - startTime} milliseconds`);
	}

	// check if mounted + and if view landscape should be computed manually
	// then recompute view landscape whenever the views are updated
	$effect(() => {
		if (mounted && computeViewLandscape) {
			updateViewLandscape(views);
		}
	});
</script>

<div id="outer-container">
	<div
		id="container"
		style="width:{initSize.w}px; height:{initSize.h}px; max-width:{maxSize.w}px; max-height:{maxSize.h}px; min-width:{minSize.w}px; min-height:{minSize.h}px"
		bind:offsetWidth={width}
		bind:offsetHeight={height}
	>
		{#each views as view, i}
			<view.type
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
	{@render children?.()}
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
