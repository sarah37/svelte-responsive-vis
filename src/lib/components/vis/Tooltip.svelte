<script>
	let {
		x = -100,
		y = -100,
		content = '',
		fontSize = 12,
		textAnchor = 'middle',
		dominantBaseline = 'middle',
		backgroundColor = 'transparent'
	} = $props();
</script>

<text
	{x}
	{y}
	font-size={fontSize}
	text-anchor={textAnchor}
	dominant-baseline={dominantBaseline}
	pointer-events="none"
	stroke={backgroundColor}
	paint-order="stroke"
	stroke-width="3"
	>{content}
</text>
