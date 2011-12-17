$(function() {

	var $canvas = $('#brot'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),
		width = parseInt($canvas.attr('width')),
		height = parseInt($canvas.attr('height'));

	function runBrot(threads) {
		$('#pixel-count').text(width * height);
		
		var startTime = Date.now();

		for (var y = 0; y < height; y++) {
			var row = ctx.createImageData(width, 1),
				data = row.data,
				i = 0;
			
			for (var x = 0; x < width; x++) {
				iter = mandelbrot(x * 4 / width - 2.5, y * 3 / height - 1.5);
				if (iter < 0) {
					data[i++] = 0;
					data[i++] = 0;
					data[i++] = 0;
				} else {
					data[i++] = iter % 256;
					data[i++] = 255 - iter % 256;
					data[i++] = iter % 256;
				}
				data[i++] = 255;
			}
			ctx.putImageData(row, 0, y);
		}
		
		var delta = Date.now() - startTime;
		$('#time').text(delta + ' ms');
		$('#pps').text((width * height) / (delta / 1000));
	}

	function mandelbrot(x, y, maxIters) {
		maxIters = maxIters || 255;
		var zx = 0,
			zy = 0,
			zxtemp,
			zr2;

		for (var i = 0; i < maxIters; i++) {
			// z[n+1] = z[n]^2 + c

			zxtemp = zx * zx - zy * zy + x;
			zy = 2 * zx * zy + y;
			zx = zxtemp;

			zr2 = zx * zx + zy * zy;
			if (zr2 > 4) {
				return i;
			}
		}
		return -1;
	}
	
	runBrot(1);

});
