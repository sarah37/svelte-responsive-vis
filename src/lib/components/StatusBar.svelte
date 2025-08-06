<script>
	let { width, height, landscapeOverlay = $bindable(), viewLandscape, children } = $props();

	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let divAR = $derived(Math.round((width / height) * 100) / 100),
		divArea = $derived(Math.round(width * height));
</script>

<p>
	<strong>
		Resize the container using the handle in the botton right and watch the visualization update.
	</strong>
</p>
<hr />
<p>
	<span class="left"><strong>Current size</strong></span>
	<span class="stats">Width: {width}px</span>
	<span class="stats">Height: {height}px</span>
	<span class="stats">Aspect ratio: {divAR}</span>
</p>
<hr />
<p>
	<span class="left"><strong>Options</strong></span>

	{#if viewLandscape && viewLandscape.status === 'failed'}
		❌ Loading view landscape failed (reload page to retry)
	{:else if viewLandscape && viewLandscape.status === 'complete'}
		<input type="checkbox" id="show-landscape-overlay" bind:checked={landscapeOverlay} />
		<label for="show-landscape-overlay">Show view landscape overlay</label>
		<button
			id="export-landscape"
			onclick={window.open(
				viewLandscape.mode == 'static' ? viewLandscape.imgSrc : viewLandscape.dataURL
			)}>Download as PNG</button
		>
	{:else}
		<LoadingSpinner size={14} /> Computing view landscape...
	{/if}
</p>

<p class="marginLeft customRVOptions">{@render children?.()}</p>

<style>
	p {
		margin: 0;
		line-height: 1.3rem;
	}
	hr {
		border: none;
		border-top: 1px solid #ccc;
		margin: 0;
		max-width: 41rem;
	}
	span.stats {
		display: inline-block;
		width: 6.5rem;
	}
	span.left {
		display: inline-block;
		width: 5rem;
	}
	p.marginLeft {
		margin-left: 5rem;
	}
	input[type='checkbox'],
	:global(.customRVOptions > input[type='checkbox']) {
		margin-left: 0;
	}
	button,
	:global(.customRVOptions > select) {
		background-color: white;
		color: black;
		border: 1px solid #ccc;
		border-radius: 2rem;
		padding: 0 0.5rem 0 0.5rem;
		font-size: 0.75rem;
		height: 1.25rem;
	}
	button:hover {
		background-color: #8493d2;
		color: #f6f6f6;
		border-color: #f6f6f6;
	}
</style>
