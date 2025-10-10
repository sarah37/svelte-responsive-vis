<script>
	import Tooltip from '$lib/vis/Tooltip.svelte';
	let { data, params, context, display } = $props();

	let height = $derived(context.height);
	let width = $derived(context.width);

	const results = data.results;

	const countries = ['Scotland', 'Northern Ireland', 'Wales', 'England'].map((d) => ({
		country: d,
		data: results
			.filter((el) => el.country_name === d)
			.sort((a, b) => a.first_party > b.first_party)
	}));

	const n_categories = countries.length;
	const n_datapoints = results.length;

	function partsSums(ls) {
		let sum = 0;
		let res = [0];
		for (let i = 1; i <= ls.length; i++) {
			sum += ls[i - 1];
			res.push(sum);
		}
		return res;
	}

	// width * height = total area available
	// one square needs size+padding ^2
	// total number of squares
	// width-wise: width / size+padding
	// height-wise:

	// (width / size+padding) * (height / size+padding) = n_squares + 4 * (width / size+padding)

	// Layout
	let wide = params.orientation == 'horizontal'; // vertical is default

	let label = 22; // could update this step-wise?
	let margin = 3;
	let gap = 10; // gap for horizontal version

	let w = $derived(width - margin * 2),
		h = $derived(wide ? height - label - margin * 2 : height - label * n_categories - margin * 2),
		s = $derived(
			wide
				? Math.pow(((w * h) / n_datapoints) * 0.5, 0.56)
				: Math.pow(((w * h) / n_datapoints) * 0.8, 0.51)
		),
		row_col = $derived(wide ? Math.floor(h / s) : Math.floor(w / s)),
		translate = $derived(partsSums(countries.map((d) => Math.ceil(d.data.length / row_col) * s)));

	// 20px for each header, 5px *2 for margins

	// Tooltip
	let x = $state(),
		y = $state(),
		content = $state();
	function handleMouseover(event, item) {
		x = event.layerX + 5;
		y = event.layerY;
		content = item.constituency_name;
	}
	function handleMouseout() {
		x = -100;
		y = -100;
		content = '';
	}
</script>

{#if display}
	<svg {width} {height} id="svg">
		<clipPath id="rect-clip-path" />

		<g id="wafflechart">
			<g transform="translate({margin},{margin})">
				{#each countries as country, i (i)}
					<g
						transform="translate({wide ? translate[i] + gap * i : 0},{wide
							? label
							: translate[i] + label * (i + 1)})"
					>
						<text font-size={label * 0.5} y={-0.13 * label} font-weight="bold"
							>{wide && country.country == 'Northern Ireland' ? 'NI' : country.country}</text
						>
						{#each country.data as item, j (j)}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<rect
								width={s}
								height={s}
								stroke="#fff"
								stroke-width="1"
								x={wide ? Math.floor(j / row_col) * s : (j % row_col) * s}
								y={wide ? (j % row_col) * s : Math.floor(j / row_col) * s}
								fill={params.colorScale(item.first_party)}
								onfocus={(e) => handleMouseover(e, item)}
								onmouseover={(e) => handleMouseover(e, item)}
								onmouseout={handleMouseout}
								onblur={handleMouseout}
							/>
						{/each}
					</g>
				{/each}
			</g>
		</g>
		<Tooltip
			bind:x
			bind:y
			bind:content
			backgroundColor="#fffd"
			textAnchor="left"
			dominantBaseline="top"
		/>
	</svg>
{/if}

<style>
	rect:hover {
		stroke: none;
	}
</style>
