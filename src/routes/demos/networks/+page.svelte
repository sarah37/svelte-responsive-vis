<script>
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	// import { default as marieboucher } from '$lib/data/marie-boucher/marieboucher.csv';
	import * as links from '$lib/data/les-mis/les-mis-links.json';
	import * as nodes from '$lib/data/les-mis/les-mis-nodes.json';

	import NetPanorama from '$lib/components/NetPanorama.svelte';

	let width, height;

	// user can select a dataset using the dropdown menu
	const datasets = {
		lesmis: {
			label: 'Les Mis',
			data: [
				{
					name: 'nodes',
					values: nodes.default
				},
				{
					name: 'links',
					values: links.default
				}
			],
			networks: [
				{
					name: 'network',
					nodes: 'nodes',
					links: 'links',
					directed: true,
					addReverseLinks: true,
					source_node: ['id', 'source'],
					target_node: ['id', 'target'],
					metrics: [{ metric: 'degree' }]
				}
			],
			nodeLabel: 'name',
			size: {
				nodelink: { width: 680, height: 680, x: 10, y: 10 },
				arcdiagram: {
					x: 500, // space for arcs on the left
					y: 10,
					width: 120,
					height: 1100
				},
				adjacency_matrix: {
					x: 115, // space for labels
					y: 115,
					width: 1000,
					height: 1000
				}
			}
		}
		// marieboucher: {
		// 	label: 'Marie Boucher',
		// 	data: [
		// 		{
		// 			name: 'marieboucher',
		// 			values: marieboucher
		// 		}
		// 	],
		// 	networks: [
		// 		{
		// 			name: 'network',
		// 			parts: [
		// 				{
		// 					data: 'marieboucher',
		// 					yieldsLinks: [
		// 						{
		// 							source_id: { field: 'Name1' },
		// 							source_node_type: 'person',
		// 							source_id_field: 'id',

		// 							target_id: { field: 'Name2' },
		// 							target_node_type: 'person',
		// 							target_id_field: 'id',

		// 							data: ['*'],

		// 							addReverseLinks: true
		// 						}
		// 					]
		// 				}
		// 			],
		// 			transform: [{ type: 'metric', metric: 'degree' }]
		// 		}
		// 	],
		// 	nodeLabel: 'id',
		// 	size: {
		// 		nodelink: { width: 680, height: 430, x: 10, y: 10 },
		// 		arcdiagram: {
		// 			x: 830, // space for arcs on the left
		// 			y: 10,
		// 			width: 220,
		// 			height: 1700
		// 		},
		// 		adjacency_matrix: {
		// 			x: 115,
		// 			y: 115,
		// 			width: 1000,
		// 			height: 1000
		// 		}
		// 	}
		// }
	};
	const datasetsKeys = Object.keys(datasets);
	let selectedDataset = 'lesmis';
	$: console.log('Dataset updated: ', selectedDataset);

	// based on: https://netpanorama-editor.netlify.app/#marie-boucher
	$: spec_nodelink = {
		...datasets[selectedDataset].size.nodelink,
		data: datasets[selectedDataset].data,
		networks: datasets[selectedDataset].networks,
		layouts: [
			{
				name: 'layout',
				network: 'network',
				type: 'd3-force'
			}
		],
		scales: [
			{
				name: 'radius',
				type: 'linear',
				range: [1, 500],
				domain: { data: 'network.nodes', field: 'degree' }
			},
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: { data: 'network.nodes', field: 'degree' }
			}
		],
		vis: [
			{
				entries: 'network.links',
				layout: 'layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target'
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',
				mark: {
					type: 'circle',
					area: { field: 'degree', scale: 'radius' },
					fill: { field: 'degree', scale: 'color' },
					tooltip: {
						expression:
							'datum.' +
							datasets[selectedDataset].nodeLabel +
							" + ' (degree ' + datum.degree + ')' "
					}
				}
			}
		]
	};

	// based on: https://netpanorama-editor.netlify.app/#arc-diagram
	$: spec_arcdiagram = {
		...datasets[selectedDataset].size.arcdiagram,
		data: datasets[selectedDataset].data,
		networks: datasets[selectedDataset].networks,
		scales: [
			{
				name: 'radius',
				type: 'linear',
				range: [1, 200],
				domain: { data: 'network.nodes', field: 'degree' }
			},
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: { data: 'network.nodes', field: 'degree' }
			}
		],
		orderings: [
			{
				name: 'degree_order',
				data: 'network.nodes',
				orderBy: 'degree'
			}
		],
		layouts: [
			{
				name: 'layout',
				data: 'network.nodes',
				pattern: 'linear',
				order: 'degree_order',
				orientation: 'vertical'
			}
		],
		vis: [
			{
				entries: 'network.links',
				layout: 'layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target',
					shape: 'arc',
					directionForShape: { ordering: 'degree_order' }
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',

				mark: {
					type: 'circle',
					area: { field: 'degree', scale: 'radius' },
					fill: { field: 'degree', scale: 'color' },
					tooltip: { field: 'name' }
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',

				mark: {
					type: 'text',
					text: { field: datasets[selectedDataset].nodeLabel },
					dx: 10,
					dy: 4
				}
			}
		]
	};

	$: spec_adjacency_matrix = {
		...datasets[selectedDataset].size.adjacency_matrix,
		data: datasets[selectedDataset].data,
		networks: datasets[selectedDataset].networks,
		scales: [
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: [0, 10]
			}
		],

		orderings: [
			{
				name: 'o',
				data: 'network.nodes',
				method: 'optimal-leaf-order',
				network: 'network'
			}
		],

		tables: [
			{
				name: 'adjacencyMatrix',
				data: 'network.links',
				rowOrder: {
					order: 'o',
					field: 'source'
				},
				colOrder: {
					order: 'o',
					field: 'target'
				}
			}
		],
		vis: [
			{
				table: 'adjacencyMatrix',
				rowLabels: {
					field: 'source.' + datasets[selectedDataset].nodeLabel,
					align: 'right',
					dx: -10,
					dy: -3
				},
				colLabels: { field: 'target.' + datasets[selectedDataset].nodeLabel, dx: 10, dy: -3 },

				mark: {
					type: 'square',
					area: 110,

					fill: {
						condition: {
							test: 'datum.size < 1',
							value: 'white'
						},

						// otherwise, apply the color scale
						scale: 'color',
						expression: 'datum.size'
					},

					tooltip: {
						expression:
							'datum.key[0].' +
							datasets[selectedDataset].nodeLabel +
							" + ' -> ' + datum.key[1]." +
							datasets[selectedDataset].nodeLabel +
							" + ' (' + datum.size + ')' "
					}
				}
			}
		]
	};

	$: views = [
		{
			type: NetPanorama,
			data: null, // data is included in spec
			params: { data: selectedDataset, spec: spec_adjacency_matrix },
			conditions: { minAdjacencyMatrixLabelSize: 6 }
		},

		{
			type: NetPanorama,
			data: null, // data is included in spec
			params: { data: selectedDataset, spec: spec_arcdiagram },
			conditions: { minArcDiagramLabelSize: 6 }
		},
		{
			type: NetPanorama,
			data: null, // data is included in spec
			params: { data: selectedDataset, spec: spec_nodelink },
			conditions: {}
		}
	];

	let viewLandscape, landscapeOverlay;
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Networks</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape>
	<!-- Select dataset:
	<select bind:value={selectedDataset}>
		{#each datasetsKeys as dataset}
			<option value={dataset}>
				{datasets[dataset].label}
			</option>
		{/each}
	</select> -->
</StatusBar>

<ResponsiveVis {views} maxSize={{ w: 1000, h: 1000 }} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
