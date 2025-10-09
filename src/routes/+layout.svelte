<script>
	let { children } = $props();
</script>

<h1>Responsive Visualization with Svelte</h1>

<div id="content">
	{@render children?.()}
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

	h1 {
		margin: 10px;
	}

	#content {
		margin: 10px;
	}
</style>
