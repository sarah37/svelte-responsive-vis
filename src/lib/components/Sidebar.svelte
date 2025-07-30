<script>
	import { base } from '$app/paths';

	let showDropdown = false;

	function toggleDropdown() {
		console.log('toggle');
		showDropdown = !showDropdown;
	}

	const demos = [
		{ slug: 'networks', title: 'Networks' },
		{ slug: 'population-map', title: 'Population Map' },
		{ slug: 'scatterplot', title: 'Movies Scatterplot' },
		{ slug: 'test', title: 'Test Page' },
		{ slug: 'uk-election', title: 'UK Election Map' }
	];
</script>

<div id="sidebar-content">
	<h1>Responsive Visualization Collection</h1>
	<h2>Experiments from <a href="https://sarahschoettler.com/">Sarah Schöttler</a>'s research</h2>

	<!-- reload page entirely when any of these links are clicked -- not sure if necessary? -->
	<nav data-sveltekit-reload>
		<ul class="demos">
			{#each demos as item}
				<li><a href="{base}/demos/{item.slug}">{item.title}</a></li>
			{/each}
		</ul>

		<div class="demos-small">
			<button class="dropdown-button" on:click={toggleDropdown}>demos ▼</button>
			<div class="dropdown-content" class:show={showDropdown}>
				{#each demos as item}
					<a href="{base}/demos/{item.slug}">{item.title}</a>
				{/each}
			</div>
		</div>
	</nav>
</div>

<style>
	#sidebar-content {
		display: block;
		padding: 1rem 1rem 0.6rem;
	}
	h1 {
		margin: 0;
		font-size: 1.5em;
	}
	h2 {
		margin: 0.5rem 0 0 0;
		font-size: 1.2em;
	}

	.demos {
		display: inline-block;
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
