<script>
	import Nav from '$lib/components/Nav.svelte';
</script>

<svelte:head>
	<style>
		* {
			font-family: sans-serif;
		}
		body,
		html {
			margin: 0;
			padding: 0;
			background-color: #f6f6f6;
		}
	</style>
</svelte:head>

<div id="header">
	<h1>Constraint-Based Breakpoints for Responsive Visualization</h1>
	<Nav />
</div>

<div id="content">
	<slot />
</div>

<style>
	h1 {
		font-size: 2rem;
		margin: 0.4rem 0;
		background-image: linear-gradient(to right, #7a6cd7, #48d6be, #fafa5a);
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-webkit-text-fill-color: transparent;
		-moz-text-fill-color: transparent;
	}
	#header {
		display: block;
		background-color: #fff;
		padding: 1rem 1rem 0.6rem;
		box-shadow: #64646f33 0px 7px 29px 0px;
	}
	#content {
		padding: 1rem;
		font-size: 0.75rem;
	}
</style>
