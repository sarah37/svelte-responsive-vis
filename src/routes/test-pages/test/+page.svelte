<script>
	import StatusBar from '$lib/ui/StatusBar.svelte';
	import { ResponsiveVis, View } from 'svelte-responsive-vis';
	import { minHeight, minWidth } from 'svelte-responsive-vis/constraints';

	import TestVis from '$lib/vis/TestVis.svelte';

	let width = $state(),
		height = $state();

	let viewLandscape = $state(),
		landscapeOverlay = $state(false);
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Test</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis
	resizable
	computeViewLandscape
	viewLandscapeOverlay={landscapeOverlay}
	minSize={{ w: 100, h: 100 }}
	maxSize={{ w: 1000, h: 1000 }}
	initSize={{ w: 800, h: 600 }}
	bind:width
	bind:height
	bind:viewLandscape
>
	<View conditions={[minWidth(600)]}>
		<TestVis color="#000" {width} {height} />
	</View>
	<View conditions={[minHeight(350)]}>
		<TestVis color="#f00" {width} {height} />
	</View>
	<View>
		<TestVis color="#00f" {width} {height} />
	</View>
</ResponsiveVis>
