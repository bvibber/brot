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
				data[i++] = x % 256;
				data[i++] = y % 256;
				data[i++] = x % 256;
				data[i++] = 255;
			}
			ctx.putImageData(row, 0, y);
		}
		
		var delta = Date.now() - startTime;
		$('#time').text(delta + ' ms');
		$('#pps').text((width * height) / (delta / 1000));
	}
	
	runBrot(1);

});
