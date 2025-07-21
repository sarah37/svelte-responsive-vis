<script>
	export let width, height;
	export let landscapeOverlay;
	export let viewLandscape;

	$: width;
	$: height;

	let divAR, divArea;

	$: divAR = Math.round((width / height) * 100) / 100;
	$: divArea = Math.round(width * height);
</script>

<p>
	<strong>
		Resize the container using the handle in the botton right and watch the visualization update.
	</strong>
</p>
<hr />
<p>
	<!-- can't have any whitespace in here -->
	<span class="left"><strong>Current size</strong></span><span class="stats">Width: {width}px</span
	><span class="stats">Height: {height}px</span><span class="stats">Aspect ratio: {divAR}</span>
</p>
<hr />
<p>
	<span class="left"><strong>Options</strong></span><input
		type="checkbox"
		id="show-landscape-overlay"
		bind:checked={landscapeOverlay}
	/><label for="show-landscape-overlay">Show view landscape overlay</label>
	<button
		id="export-landscape"
		on:click={window.open(
			viewLandscape.mode == 'static' ? viewLandscape.imgSrc : viewLandscape.dataURL
		)}>Download as PNG</button
	>
</p>
<p class="marginLeft customRVOptions"><slot /></p>

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
