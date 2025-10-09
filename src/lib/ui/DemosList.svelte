<script>
	import { base } from '$app/paths';

	const demos = [
		{ slug: 'networks', title: 'Networks' },
		{ slug: 'population-map', title: 'Population Map' },
		{ slug: 'scatterplot', title: 'Movies Scatterplot' },
		{ slug: 'uk-election', title: 'UK Election Map' },
		{ slug: 'test', title: 'Test Page' },
		{ slug: 'minimal-test', title: 'Test Page (minimal)' }
	];
</script>

<!-- reload page entirely when any of these links are clicked -- not sure if necessary? -->
<nav data-sveltekit-reload>
	<ul class="demos">
		{#each demos as item}
			<li><a href="{base}/demos/{item.slug}">{item.title}</a></li>
		{/each}
	</ul>
</nav>

<style>
	.demos {
		display: inline-block;
	}
</style>
