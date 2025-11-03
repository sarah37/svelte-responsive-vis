<script>
	let { width, height, landscapeOverlay = $bindable(), viewLandscape, children } = $props();

	import LoadingSpinner from '$lib/ui/LoadingSpinner.svelte';

	let divAR = $derived(Math.round((width / height) * 100) / 100);

	$inspect(viewLandscape);
</script>

<p>Resize the container using the handle in the botton right and watch the visualization update.</p>
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

	{#if viewLandscape && viewLandscape.status === 'disabled'}
		❌ View landscape disabled
	{:else if viewLandscape && viewLandscape.status === 'failed'}
		❌ Loading view landscape failed (reload page to retry)
	{:else if viewLandscape && viewLandscape.status === 'complete'}
		<input type="checkbox" id="show-landscape-overlay" bind:checked={landscapeOverlay} />
		<label for="show-landscape-overlay">Show view landscape overlay</label>
		<button
			id="export-landscape"
			onclick={() => window.open(URL.createObjectURL(viewLandscape.blob))}
		>
			Download as PNG
		</button>
	{:else}
		<LoadingSpinner size={14} /> Computing view landscape...
	{/if}
</p>

<p class="marginLeft customRVOptions">{@render children?.()}</p>

<style>
	p,
	span,
	hr {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5em;
	}
	hr {
		border: none;
		border-top: 1px solid #ccc;
		max-width: 43.5em;
	}
	span.stats {
		display: inline-block;
		width: 9em;
	}
	span.left {
		display: inline-block;
		width: 7em;
	}
	p.marginLeft {
		margin-left: 7em;
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
		padding: 0 0.5rem 0 0.3rem;
		font-size: 0.75rem;
		height: 1.25rem;
	}
	button:hover {
		background-color: #d2e5b6;
		/* color: #f6f6f6; */
		border-color: #9fb087;
	}
</style>
