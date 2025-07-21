<script>
	import { onMount } from 'svelte';

	export let x,
		y,
		anchorX = 'left',
		anchorY = 'top', // position
		s = 1,
		colors,
		labels,
		title = '';

	let g, size;
	let left = 0,
		top = 0;
	$: size, left, top;

	onMount(() => {
		size = g.getBBox();

		left = anchorX == 'left' ? x : anchorX == 'right' ? x - size.width * s : x - 0.5 * size.width;
		top = anchorY == 'top' ? y : anchorY == 'bottom' ? y - size.height * s : y - 0.5 * size.height;
	});
</script>

<g bind:this={g} transform="translate({left}, {top}) scale({s})">
	<text font-weight="bold" font-size="{12}px" dy={12}>{title}</text>
	{#each colors as color, i}
		<g transform="translate(0,{i * 14 + 17})">
			<rect width={13} height={13} fill={color} />
			<text x={14} y={10} font-size="{10}px">{labels[i]}</text>
		</g>
	{/each}
	<!-- <text font-weight="bold" font-size="{12 / s}px" dy={12 / s}>{title}</text>
	{#each colors as color, i}
		<g transform="translate(0,{(i * 14 + 17) / s})">
			<rect width={13 / s} height={13 / s} fill={color} />
			<text x={14 / s} y={10 / s} font-size="{10 / s}px">{labels[i]}</text>
		</g>
	{/each} -->
</g>

<!-- 
            g.attr('transform', `translate(${t[0]},${t[1]}) scale(${s})`);
-->
