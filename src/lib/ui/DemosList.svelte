<script>
	import { resolve } from '$app/paths';

	// get paths for all demos
	const demos = Object.keys(
		import.meta.glob('/src/routes/demos/**/+page.svelte', {
			eager: true
		})
	)
		.map((key) => key.replace(/\/src\/routes\/demos\/|\/?\+page\.svelte/g, ''))
		.map((slug) => ({ slug: slug, title: slug.replaceAll('-', ' ') }));
</script>

<!-- reload page entirely when any of these links are clicked -- not sure if necessary? -->
<nav data-sveltekit-reload>
	<ul class="demos">
		{#each demos as item (item.slug)}
			<li><a href={resolve('/demos/[slug]', { slug: item.slug })}>{item.title}</a></li>
		{/each}
	</ul>
</nav>

<style>
	.demos {
		display: inline-block;
	}
</style>
