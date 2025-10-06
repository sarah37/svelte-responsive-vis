<script>
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ResponsiveVis from 'svelte-responsive-vis';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';

	import TestVis from '$lib/components/vis/TestVis.svelte';
	import { minHeight, minWidth } from '$lib/constraints/simple.js';

	let width = $state(),
		height = $state();

	const views = [
		{
			type: TestVis,
			data: [],
			params: { color: '#000' },
			conditions: [minWidth(600)]
		},
		{
			type: TestVis,
			data: [],
			params: { color: '#f00' },
			conditions: [minHeight(350)]
		},
		{
			type: TestVis,
			data: [],
			params: { color: '#00f' },
			conditions: []
		}
	];

	let viewLandscape = $state(),
		landscapeOverlay = $state(false);
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Test</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis
	{views}
	minSize={{ w: 100, h: 100 }}
	maxSize={{ w: 1000, h: 1000 }}
	initSize={{ w: 800, h: 600 }}
	bind:width
	bind:height
	computeViewLandscape={true}
	bind:viewLandscape
>
	{#if landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
