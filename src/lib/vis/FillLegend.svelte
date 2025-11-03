<script>
	let { x, y, anchorX = 'left', anchorY = 'top', s = 1, colors, labels, title = '' } = $props();

	let g = $state();
	let size = $derived.by(() => {
		// check if g element already exists
		if (g === undefined) {
			return { width: 0, height: 0 };
		} else {
			return g.getBBox();
		}
	});
	let left = $derived(
		anchorX == 'left' ? x : anchorX == 'right' ? x - size.width * s : x - 0.5 * size.width
	);
	let top = $derived(
		anchorY == 'top' ? y : anchorY == 'bottom' ? y - size.height * s : y - 0.5 * size.height
	);
</script>

<g bind:this={g} transform="translate({left}, {top}) scale({s})">
	<text font-weight="bold" font-size="{12}px" dy={12}>{title}</text>
	{#each colors as color, i (i)}
		<g transform="translate(0,{i * 14 + 17})">
			<rect width={13} height={13} fill={color} />
			<text x={14} y={10} font-size="{10}px">{labels[i]}</text>
		</g>
	{/each}
</g>
