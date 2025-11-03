<script>
	import { getContext } from 'svelte';

	let { color = '#000', width, height } = $props();

	let margin = 5;
</script>

<svg {width} {height} xmlns="http://www.w3.org/2000/svg">
	<line
		x1="{margin}px"
		y1="{margin}px"
		x2="{width - margin}px"
		y2="{height - margin}px"
		stroke={color}
		stroke-width="3px"
		stroke-linecap="round"
	/>
	<line
		x1="{width - margin}px"
		y1="{margin}px"
		x2="{margin}px"
		y2="{height - margin}px"
		stroke={color}
		stroke-width="3px"
		stroke-linecap="round"
	/>
</svg>
