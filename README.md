## About

`svelte-responsive-vis` is a Svelte 5 library that facilitates creating responsive visualizations with multiple views for different sizes. The library implements _constraint-based breakpoints_, a novel approach to responsive visualization introduced in our paper [Constraint-Based Breakpoints for Responsive Visualization Design and Development](https://doi.org/10.1109/TVCG.2024.3410097).

## Getting Started

### Installation

The library requires Svelte 5. You can install it via npm using your preferred package manager:

```
npm install svelte-responsive-vis
```

To create a responsive visualization, `import { ResponsiveVis, View } from 'svelte-responsive-vis'`, as well as import any conditions you want to use from (see [below](#conditions)) from `svelte-responsive-vis/conditions`. Use a visualization library of your choice to create the visualizations for each view. We recommend [SveltePlot]() for (more or less) standard visualization designs and D3 for anything custom.

- Add a resizable demo
- Link to svelte playground
- Example code

### `ResponsiveVis` and the `View` component

A new responsive visualization is created using the `ResponsiveVis` component. You can then nest as many or a few views as required, using the `View` component. Inside each `View`, render the visualization design for the view using your visualization library of choice. You can use any visualization library compatible with Svelte 5 for this and you can combine multiple libraries in one responsive visualization if you wish. We have demos for SveltePlot (recommended), Vega-Lite (or Vega), and custom visualizations created with D3.

This demo creates a scatterplot which turns into a binned heatmap when the circles in the scatterplot begin to overlap excessively (resize the container to see the change):

```svelte
<ResponsiveVis resizable bind:height>
	<View
		conditions={[
			maxOverplotting(0.0012, ratings, scatter_radius, marginX, marginY, xDomain, yDomain)
		]}
	>
		<Plot grid {height} x={{ domain: xDomain }} y={{ domain: yDomain }}>
			<Dot
				r={scatter_radius}
				data={movies.default}
				x="IMDB Rating"
				y="Rotten Tomatoes Rating"
				stroke="#0006"
			/>
		</Plot>
	</View>
	<View>
		<Plot color={{ scheme: 'YlGnBu' }} {height}>
			<Rect
				{...bin(
					{ data: movies.default, x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
					{ fill: 'count' }
				)}
			/>
		</Plot>
	</View>
</ResponsiveVis>
```

[demo]

[svelte playground]

### Conditions

The package includes a couple of condition functions to get you started. (footnote, in the paper these are called constraints). You can import these from `svelte-responsive-vis/conditions`.
There are a few simple ones that don’t use any information about the visualization itself:

- `minWidth(min)` – sets a minimum width (in px)
- `maxWidth(max)` – sets a maximum width (in px)
- `minHeight(min)` – sets a minimum height (in px)
- `maxHeight(max)` – sets a maximum height (in px)
- `minAspectRatio(min)` – sets a minimum aspect ratio (width divided by height)
- `maxAspectRatio(max)` – sets a maximum aspect ratio (width divided by height)
- `minSize(min)` – sets a minimum size overall (width multiplied by height, in px)
- `maxSize(max)` – sets a maximum size overall (width multiplied by height, in px)

There are conditions specifically for maps with D3:

- `maxAspectRatioDiff(maxDiff, projection, data)` – sets a maximum ratio (maxDiff) between the aspect ratio of the container and the map, provided the projection of the map and the geojson data used to create the map
- `minAreaSize(minSize, projection, data)` – sets a minimum size (in px) for the smallest spatial unit of the map, provided a limit for the smallest permissible size in px (minSize), the projection of the map and the geojson data used to create the map

For scatterplots and other visualizations with equally sized circle marks, the package provides a condition to limit the amount of allowed overlap:

```
maxOverplotting(
-	    maxScore,
-	    pos,
-	    r,
-	    marginX = 0,
-	    marginY = 0,
-	    xDomain = undefined,
-	    yDomain = undefined
```

It is straightforward to implement additional conditions specific to the visualization designs you want to use. Some examples of custom conditions can be found in the demos. A valid condition returns a function that takes two arguments – the width and height of the container – and returns `true` (or another truthy value) if the condition is fulfilled, and `false` (or another falsy value) if not. The provided conditions are all implemented as functions that take in various parameters (such as the desired minimum aspect ratio) and return such a function. For example, here’s how the minAspectRatio condition function is implemented:

```
function minAspectRatio(min) {
    return (w, h) => w / h > min;
}
```

For a more complex example, see the [maxOverplotting code on GitHub]().

### The View Landscape

The view landscape is a tool that helps you keep track of the various views and the effects of the conditions you have set for them. Given the current set of views, conditions, and visualized dataset, it produces a plot showing which view is displayed at each (container) size. This allows you to see which sizes and aspect ratios lack suitable views, how much area each view covers, and how changes to your conditions affect the responsive visualization. Read more about the view landscape in our paper.

`svelte-responsive-vis` can generate the view landscape and either display it as an overlay or output the image data for you to use in another way. The view landscape takes a moment (typically a few hundred ms up to several seconds, depending on the complexity of the conditions and the performance of your device) to compute, so it is intended as a tool while designing, developing, and testing new responsive visualizations and should be disabled before publishing the final visualization.

## Want to help?

If you would like to help improve this library, please feel free to open issues and pull requests on [GitHub](). I would be especially grateful if someone wanted to help create type definitions (there aren’t any as of now). Please get in touch if you have questions or suggestions!
