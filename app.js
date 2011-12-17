$(function() {

	var $canvas = $('#brot'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),
		width = parseInt($canvas.attr('width')),
		height = parseInt($canvas.attr('height'));

	function runBrot(threads) {
		$('#pixel-count').text(width * height);
		ctx.clearRect(0, 0, width, height);
		
		var todo = height,
			workers = [];

		var drawLine = function(event, thread) {
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
					data[i + thread % 2] = 128 + iter % 128;
					i += 2;
					data[i++] = iter % 256;
				}
				data[i++] = 255;
			}
			ctx.putImageData(row, 0, y);

			todo--;
			if (todo == 0) {
				$.each(workers, function() {
					this.terminate();
				});
				workers = null;
				var delta = Date.now() - startTime;
				$('#time').text(delta + ' ms');
				$('#pps').text((width * height) / (delta / 1000));
			}
		};
		
		var startTime = Date.now();
		for (var thread = 0; thread < threads; thread++) {
			(function() {
				var i = thread,
					worker = new Worker('worker.js');
				worker.onmessage = function(event) {
					drawLine(event, i);
				};
				var msg = {
					width: width,
					height: height,
					start: Math.floor((height / threads) * i),
					end: Math.floor((height / threads) * (i + 1)) - 1
				};
				worker.postMessage(msg);
				workers[i] = worker;
			})();
		}
	}
	
	runBrot(4);
	
	$('#threads').change(function() {
		var threads = parseInt($(this).val());
		runBrot(threads);
	});

});
