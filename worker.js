importScripts('mandelbrot.js');

self.onmessage = function(event) {
	var msg = event.data,
		start = msg.start,
		end = msg.end,
		cx = msg.cx,
		cy = msg.cy,
		zoom = msg.zoom,
		width = msg.width,
		height = msg.height;

		for (var y = start; y <= end; y++) {
			var iters = [];
			
			for (var x = 0; x < width; x++) {
				iters[x] = mandelbrot(
					(x - width / 2) * (zoom / width) + cx,
					(height / 2 - y) * (zoom * 0.75 / height) + cy
				);
			}
			
			postMessage({
				y: y,
				iters: iters
			});
		}
};

