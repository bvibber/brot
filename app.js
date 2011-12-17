$(function() {

	var $canvas = $('#brot'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),
		width = parseInt($canvas.attr('width')),
		height = parseInt($canvas.attr('height'));

	function runBrot(threads) {
		$('#pixel-count').text(width * height);
		
		var worker = new Worker('worker.js'),
			todo = height;
		worker.onmessage = function(event) {
			var msg = event.data,
				y = msg.y,
				iters = msg.iters,
				row = ctx.createImageData(width, 1),
				data = row.data,
				i = 0;
			
			for (var x = 0; x < width; x++) {
				iter = iters[x];
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

			todo--;
			if (todo == 0) {		
				var delta = Date.now() - startTime;
				$('#time').text(delta + ' ms');
				$('#pps').text((width * height) / (delta / 1000));
			}
		};
		
		var startTime = Date.now();
		worker.postMessage({
			width: width,
			height: height,
			start: 0,
			end: height - 1
		});
	}
	
	runBrot(1);

});
