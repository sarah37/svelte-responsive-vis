<script>
	/**
	 * Adapted for Svelte from https://observablehq.com/@harrystevens/circle-legend
	 * @typedef {Object} Props
	 * @property {any} x
	 * @property {any} y
	 * @property {string} [anchorX]
	 * @property {string} [anchorY]
	 * @property {any} scale -  the scale function used for the circles
	 * @property {any} tickValues
	 * @property {any} [tickFormat]
	 * @property {number} [tickSize]
	 * @property {string} [color]
	 * @property {number} [s] - scale factor for resizing
	 */

	/** @type {Props} */
	let {
		x,
		y,
		anchorX = 'left',
		anchorY = 'top',
		scale,
		tickValues,
		tickFormat = (d) => d,
		tickSize = 5,
		color = '#000',
		s = 1
	} = $props();

	let ticks = tickValues || scale.ticks();
	ticks.sort((a, b) => b - a);

	const max = ticks[0];

	const left = anchorX == 'left' ? x : anchorX == 'right' ? x - 2 * scale(max) : x - scale(max);
	const top = anchorY == 'top' ? y : anchorY == 'bottom' ? y - 2 * scale(max) : y - scale(max);
</script>

<g transform="translate({left}, {top})" stroke-width="{1 / s}px">
	{#each ticks as d, i}
		<circle fill="none" stroke={color} cx={scale(max)} cy={scale(d)} r={scale(d)} />
		<line
			stroke={color}
			stroke-dasharray={`${4 / s}, ${2 / s}`}
			x1={scale(max)}
			x2={tickSize + scale(max) * 2}
			y1={scale(d) * 2}
			y2={scale(d) * 2}
		/>
		<text
			font-size={12 / s}
			dominant-baseline="central"
			x={tickSize + scale(max) * 2}
			y={scale(d) * 2}>{tickFormat(d, i)}</text
		>
	{/each}
</g>
