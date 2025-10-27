<script>
	import { ResponsiveVis, View } from '$lib';
	import { minHeight, minWidth } from '$lib/constraints/';
	import TestVis from '$lib/vis/TestVis.svelte';

	let height = $state();
	let width = $state();
</script>

<ResponsiveVis
	resizable
	minSize={{ w: 100, h: 100 }}
	maxSize={{ w: 1000, h: 1000 }}
	initSize={{ w: 800, h: 600 }}
	bind:height
	bind:width
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
