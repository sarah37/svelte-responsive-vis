<script>
	let { viewLandscape } = $props();

	// will only run once when this component is mounted, should be enough warning
	if (!viewLandscape || viewLandscape.status !== 'complete') {
		console.warn(
			'You have enabled the view landscape overlay but no view landscape is available. Make sure that view landscape computation is enabled.'
		);
	}
</script>

{#if viewLandscape && viewLandscape.status === 'complete'}
	<div
		id="landscape-overlay"
		style="width:{viewLandscape.size[0]}px; height:{viewLandscape
			.size[1]}px; background-image: url({URL.createObjectURL(viewLandscape.blob)})"
	></div>
{/if}

<style>
	#landscape-overlay {
		position: absolute;
		display: block;
		left: 1px;
		top: 1px;
		pointer-events: none;
		opacity: 0.35;
	}
</style>
