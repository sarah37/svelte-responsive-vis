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
	<h1>Responsive Visualization Collection</h1>
	<h2>Experiments from <a href="https://sarahschoettler.com/">Sarah Schöttler</a>'s research</h2>
	<Nav />
</div>

<div id="content">
	<slot />
</div>

<style>
	:global {
		html,
		body {
			background: #fffff0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
				'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
				'Noto Color Emoji';
			--blue: #000cfb;
			margin: 0;
			padding: 0;
		}
	}

	#header {
		display: block;
		background-color: #fff;
		padding: 1rem 1rem 0.6rem;
	}
	#content {
		padding: 1rem;
		font-size: 0.75rem;
	}
</style>
