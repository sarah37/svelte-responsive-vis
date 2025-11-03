<script>
	let { conditions = [() => true], children } = $props();

	import { getContext } from 'svelte';

	import { VIEWS } from './ResponsiveVis.svelte';

	const { registerView, displayedView } = getContext(VIEWS);

	const view = {
		conditions
	};
	registerView(view);
</script>

{#if view === $displayedView}
	{@render children?.()}
{/if}
