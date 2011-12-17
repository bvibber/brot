$(function() {

	var $canvas = $('#brot'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),
		width = parseInt($canvas.attr('width')),
		height = parseInt($canvas.attr('height')),
		cx = -1,
		cy = 0,
		zoom = 4,
		threads = parseInt($('#threads').val()),
		workers = [];

	function runBrot() {
		$('#pixel-count').text(width * height);
		ctx.clearRect(0, 0, width, height);

		function terminate() {
			$.each(workers, function() {
				this.terminate();
			});
			workers = [];
		}
		terminate();

		var todo = height;

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
				terminate();
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
					cx: cx,
					cy: cy,
					zoom: zoom,
					start: Math.floor((height / threads) * i),
					end: Math.floor((height / threads) * (i + 1)) - 1
				};
				worker.postMessage(msg);
				workers[i] = worker;
			})();
		}
	}
	
	runBrot();
	
	$('#threads').change(function() {
		threads = parseInt($(this).val());
		runBrot();
	});
	
	$canvas.dblclick(function(event) {
		zoom /= 2;
		runBrot();
	});
	
	$canvas.mousedown(function(event) {
		event.preventDefault();
		var origX = event.clientX,
			origY = event.clientY,
			dx = 0,
			dy = 0;
		$canvas
			.bind('mousemove.dragging', function(event) {
				dx = event.clientX - origX;
				dy = event.clientY - origY;
			})
			.bind('mouseup.dragging', function(event) {
				$canvas.unbind('mousemove.dragging');
				$canvas.unbind('mouseup.dragging');
				
				cx -= (dx * zoom / width);
				cy += (dy * zoom * 0.75 / height);
				runBrot();
			});
	});

});
