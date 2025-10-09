<script>
	let { data, params, conditions, context, display } = $props();

	let height = $derived(context.height);
	let width = $derived(context.width);
</script>

{#if display}
	<svg {width} {height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" r="50" fill={params.color} />
	</svg>
{/if}
