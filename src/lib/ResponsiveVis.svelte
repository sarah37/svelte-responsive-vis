<script module>
	// use object instead of just string to ensure only components with a reference to this can modify the context
	export const VIEWS = {};
</script>

<script>
	import { range } from 'd3-array';
	import { schemeSet3 } from 'd3-scale-chromatic';
	import { tick, setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	import Worker from './worker_view_landscape.js?worker';
	import ViewLandscapeOverlay from './ui/ViewLandscapeOverlay.svelte';

	let {
		resizable = false,
		initSize = { w: 600, h: 400 },
		maxSize = { w: 1000, h: 700 },
		minSize = { w: 1, h: 1 },
		width = $bindable(),
		height = $bindable(),
		computeViewLandscape = false,
		viewLandscapeInterval = 1,
		viewLandscapeOverlay = false,
		viewLandscape = $bindable(),
		children
	} = $props();

	// color scheme for view landscape
	const vlColors = schemeSet3;

	// track all existing views and which one is currently displayed
	const views = [];
	const displayedView = writable(null);

	setContext(VIEWS, {
		registerView: (view) => {
			views.push(view);

			onDestroy(() => {
				const i = views.indexOf(view);
				views.splice(i, 1);
			});
		},

		displayView: (view) => {
			displayedView.set(view);
		},

		displayedView
	});

	$effect(() => {
		displayedView.set(selectView());
	});

	// $inspect(views);
	// $inspect($displayedView);

	function selectView() {
		// find the first view where the conditions return true

		// const startTime = performance.now();
		let firstSuitableView = views.find((view) => {
			return checkConditions(view.conditions, width, height);
		});
		// const endTime = performance.now();
		// console.log(`Checked conditions in ${endTime - startTime} ms`);
		return firstSuitableView;
	}

	function checkConditions(conditionList, w, h) {
		// checks if all conditions for a specific view are true
		const conditionResults = conditionList.map((c) => c(w, h));
		return conditionResults.every(Boolean);
	}

	async function updateViewLandscape(views) {
		// do not compute if not explicitly enabled
		if (!computeViewLandscape) {
			viewLandscape = { status: 'disabled' };
			return;
		}

		console.log('...updating view landscape');
		const startTime = performance.now();

		const worker = new Worker();

		worker.onmessage = (event) => {
			viewLandscape = event.data;
		};

		// make sure constraints + views are all done updating before recalculating
		await tick();

		const w = maxSize.w;
		const h = maxSize.h;
		const w_interval = Math.floor(w / viewLandscapeInterval);
		const h_interval = Math.floor(w / viewLandscapeInterval);

		// array of max width by max height that records which view is displayed at each size
		let arr = new Array(w_interval);
		for (let x = 0; x < arr.length; x++) {
			arr[x] = new Array(h_interval);
			for (let y = 0; y < arr.length; y++) {
				for (let i = 0; i < views.length; i++) {
					if (
						checkConditions(
							views[i].conditions,
							x * viewLandscapeInterval + 1,
							y * viewLandscapeInterval + 1
						)
					) {
						arr[x][y] = i;
						break;
					}
				}
			}
		}

		let vl_obj = {
			dataArray: arr,
			size: [w, h],
			interval: viewLandscapeInterval,
			colors: vlColors
		};

		worker.postMessage(vl_obj);

		const endTime = performance.now();
		console.log(`Computed view landscape in ${endTime - startTime} milliseconds`);
	}

	// recompute view landscape whenever the views are updated
	$effect(() => {
		updateViewLandscape(views);
	});
</script>

<div id="outer-container">
	<div
		id="container"
		class:resizable
		style="width:{initSize.w}px; height:{initSize.h}px; max-width:{maxSize.w}px; max-height:{maxSize.h}px; min-width:{minSize.w}px; min-height:{minSize.h}px"
		bind:offsetWidth={width}
		bind:offsetHeight={height}
	>
		{#if children}
			{@render children()}
		{:else}
			<p>No views provided.</p>
		{/if}
	</div>

	{#if viewLandscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</div>

<style>
	#outer-container {
		position: relative;
	}
	#container {
		overflow: hidden;
		position: relative;
		border: var(--border, none);
		/* background-color: #fff; */
	}

	#container.resizable {
		resize: both;
		border: var(--border, 1px solid #ccc);
	}
</style>
