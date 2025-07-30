<script>
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	let collapsed = false;
</script>

<div id="container">
	<div id="collapsible-sidebar" class={collapsed}>
		<Sidebar />
	</div>
	<div id="content">
		{@render children?.()}
	</div>
</div>

<style>
	:global {
		html,
		body {
			font-family:
				-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
				sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			--blue: #000cfb;
			margin: 0;
			padding: 0;
		}
	}

	#container {
		display: grid;
		grid: 'sidebar content';
		grid-template-rows: 100%;
		grid-template-columns: 250px 1fr;
	}

	#collapsible-sidebar {
		grid-area: 'sidebar';
	}
	#content {
		grid-area: 'content';
		padding: 1rem;
		font-size: 0.75rem;
	}
</style>
