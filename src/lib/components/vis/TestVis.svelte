<script>
	let { data, params, conditions, context, display, checkConditions = $bindable() } = $props();

	let height = $derived(context.height);
	let width = $derived(context.width);

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

{#if display}
	<svg {width} {height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="50" fill={params.color} />
	</svg>
{/if}
