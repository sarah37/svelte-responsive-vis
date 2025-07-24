<script>
	export let x = -100;
	export let y = -100;
	export let content = '';
	export let fontSize = 12,
		textAnchor = 'middle',
		dominantBaseline = 'middle',
		backgroundColor = 'transparent';
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
