importScripts('mandelbrot.js');

self.onmessage = function(event) {
	var msg = event.data,
		start = msg.start,
		end = msg.end,
		width = msg.width,
		height = msg.height;

		for (var y = start; y <= end; y++) {
			var iters = [];
			
			for (var x = 0; x < width; x++) {
				iters[x] = mandelbrot(x * 4 / width - 2.5, y * 3 / height - 1.5);
			}
			
			postMessage({
				y: y,
				iters: iters
			});
		}
};

