<script>
	import { base } from '$app/paths';
	import DemosList from '$lib/ui/DemosList.svelte';
</script>

<svelte:head>
	<title>Svelte Responsive Vis</title>
</svelte:head>

<div class="intro">
	<code>svelte-responsive-vis</code> is a Svelte 5 library that facilitates creating responsive
	visualizations with multiple views for different sizes. The library implements
	<i>constraint-based breakpoints</i>, a novel approach to responsive visualization introduced in
	our paper
	<a href="https://doi.org/10.1109/TVCG.2024.3410097"
		>Constraint-Based Breakpoints for Responsive Visualization Design and Development</a
	>.
</div>

<h2>Demo Visualizations</h2>

<DemosList />
