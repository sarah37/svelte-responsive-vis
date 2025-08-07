function minWidth(min) {
	return (w) => w > min;
}

function maxWidth(max) {
	return (w) => w < max;
}

function minHeight(min) {
	return (_, h) => h > min;
}

function maxHeight(max) {
	return (_, h) => h < max;
}

function minAspectRatio(min) {
	return (w, h) => w / h > min;
}

function maxAspectRatio(max) {
	return (w, h) => w / h < max;
}

function minSize(min) {
	return (w, h) => w * h > min;
}

function maxSize(max) {
	return (w, h) => w * h < max;
}

export {
	minWidth,
	maxWidth,
	minHeight,
	maxHeight,
	minAspectRatio,
	maxAspectRatio,
	minSize,
	maxSize
};
