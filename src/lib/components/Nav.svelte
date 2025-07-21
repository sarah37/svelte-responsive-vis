<script>
	import { base } from '$app/paths';

	let showDropdown = false;

	function toggleDropdown() {
		console.log('toggle');
		showDropdown = !showDropdown;
	}
</script>

<nav data-sveltekit-reload>
	<div class="demos">
		<span>demos:</span><a href="{base}/demos/population-map">population map</a><a
			href="{base}/demos/uk-election">uk election map</a
		><a href="{base}/demos/networks">networks</a><a href="{base}/demos/scatterplot"
			>movies scatterplot</a
		>
	</div>

	<div class="demos-small">
		<button class="dropdown-button" on:click={toggleDropdown}>demos ▼</button>
		<div class="dropdown-content" class:show={showDropdown}>
			<a href="{base}/demos/population-map">population map</a>
			<a href="{base}/demos/uk-election">uk election map</a>
			<a href="{base}/demos/networks">networks</a>
			<a href="{base}/demos/scatterplot"> movies scatterplot </a>
		</div>
	</div>
</nav>

<style>
	nav a,
	.demos > *,
	button {
		display: inline-block;
		background-color: #eee;
		font-size: 0.75rem;
		text-transform: uppercase;
		height: 2rem;
		line-height: 2rem;
		border-radius: 1rem;
		border: 1px solid #fff;
		color: #222;
		padding: 0 0.75rem;
		text-decoration: none;
	}
	nav a:hover {
		background-color: #8493d2;
		color: #fff;
	}
	.demos {
		display: inline-block;
	}
	.demos > * {
		border-radius: 0;
	}
	.demos > *:first-child {
		border-radius: 1rem 0 0 1rem;
	}
	.demos > *:last-child {
		border-radius: 0 1rem 1rem 0;
	}

	.demos-small {
		display: none;
	}
	.dropdown-content {
		display: none;
	}
	.show {
		display: block;
	}
	.dropdown-content {
		width: 150px;
		position: absolute;
		z-index: 5;
	}
	.dropdown-content a {
		display: block;
		width: 100%;
		border-radius: 1rem;
	}

	@media (max-width: 710px) {
		.demos {
			display: none;
		}
		.demos-small {
			display: inline-block;
		}
	}
</style>
