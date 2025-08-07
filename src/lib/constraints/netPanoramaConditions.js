// conditions -- only based on spec, does not require anything to be rendered

function minAdjacencyMatrixLabelSize(min, spec) {
	const labelHeight = spec.height - (spec.y ? spec.y : 0);
	const nNodes = spec.data[0].values.length;
	const totalHeight = spec.height + (spec.y ? spec.y : 0);
	const totalWidth = spec.width + (spec.x ? spec.x : 0);

	return (w, h) => {
		const s = Math.min(h / totalHeight, w / totalWidth);
		return s * (labelHeight / nNodes) > min;
	};
}

function minArcDiagramLabelSize(min, spec) {
	const nNodes = spec.data[0].values.length;
	const totalHeight = spec.height + (spec.y ? spec.y : 0);
	const totalWidth = spec.width + (spec.x ? spec.x : 0);

	return (w, h) => {
		const s = Math.min(h / totalHeight, w / totalWidth);
		return s * (spec.height / nNodes) > min;
	};
}

export { minAdjacencyMatrixLabelSize, minArcDiagramLabelSize };
