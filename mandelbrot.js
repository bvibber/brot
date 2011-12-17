function mandelbrot(x, y, maxIters) {
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
