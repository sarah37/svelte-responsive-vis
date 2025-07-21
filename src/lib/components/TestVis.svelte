<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	$: height = context.height;
	$: width = context.width;
	$: display;

	checkConditions = function (w, h) {
		let c = [
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minHeight ? h > conditions.minHeight : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true,
			conditions.maxAspectRatio ? w / h < conditions.maxAspectRatio : true
		];
		return c.every(Boolean);
	};
</script>

<!-- only display if this view state is selected -->
{#if display}
	<svg {width} {height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="50" fill={params.color} />
	</svg>
{/if}
