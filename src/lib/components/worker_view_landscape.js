self.onmessage = (event) => {
	const data = event.data;
	//  {
	// 	    dataArray: arr,
	// 	    size: [w, h],
	//		interval: vlInterval,
	//      colors: [#..., #...]
	// };

	const arr = data.dataArray;
	const w = data.size[0];
	const h = data.size[1];
	const interval = data.interval;
	const colors = data.colors;

	// draw received array on a canvas
	let canvas = new OffscreenCanvas(w, h);
	let c = canvas.getContext('2d', { alpha: false });

	for (let x = 0; x < arr.length; x++) {
		for (let y = 0; y < arr[0].length; y++) {
			c.fillStyle = typeof arr[x][y] == 'number' ? colors[arr[x][y]] : '#fff';
			c.fillRect(x * interval, y * interval, interval, interval);
		}
	}

	canvas
		.convertToBlob()
		.then((blob) => {
			data.blob = blob;
			data.status = 'complete';
		})
		.catch(() => {
			data.status = 'failed';
		})
		.finally(() => {
			self.postMessage(data);
		});
};
