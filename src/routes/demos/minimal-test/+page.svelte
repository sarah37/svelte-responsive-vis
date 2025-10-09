<script>
	import ResponsiveVis from '$lib/ResponsiveVis.svelte';

	import TestVis from '$lib/vis/TestVis.svelte';
	import { minHeight, minWidth } from '$lib/constraints/simple.js';

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
</script>

<ResponsiveVis
	{views}
	minSize={{ w: 100, h: 100 }}
	maxSize={{ w: 1000, h: 1000 }}
	initSize={{ w: 800, h: 600 }}
/>
