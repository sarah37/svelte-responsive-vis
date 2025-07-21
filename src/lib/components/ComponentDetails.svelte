<script>
	export let title,
		description = '',
		githubLink,
		screenshots,
		examples;

	import { base } from '$app/paths';

	const exList = {
		scatterplot: 'Movies Scatterplot',
		networks: 'Networks',
		'uk-election': 'UK Election Map',
		'population-map': 'Population Map'
	};
</script>

<h3>{title}</h3>
{@html description}<br />
{#each screenshots as screenshot}
	<img src="{base}/img/screenshots/{screenshot}.png" />
{/each}<br />
<a href={githubLink} target="_blank">View component code on GitHub</a><br />
<strong>Used in:</strong>
{#each examples as example, i}
	<a href="{base}/demos/{example}">{exList[example]}</a>{#if i < examples.length - 1}, &#20;
	{/if}
{/each}
<br />
<strong>Implemented constraints:</strong>
<ul>
	<slot />
</ul>

<style>
	h3 {
		font-family: monospace;
		margin-top: 3rem;
	}
	img {
		max-height: 200px;
		max-width: 100%;
		margin-right: 5px;
	}
</style>
