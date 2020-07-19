class Terrain {
	constructor(_w, _h) {
		noiseSeed(0)
		this.grid = new Array(_w + 1).fill(1)
		this.total = 0
		this.grid = this.grid.map((r, i) => new Array(_h + 1).fill(1).map((c, j) => this.getHeight(i, j)))
		this.grid = this.grid.map((r) => r.map((c) => ((c * _w * _h) / (this.total) > 1) ? 1 : (c * _w * _h) / (this.total)))
	}

	getHeight(_i, _j) {
		let h = 0
		for (var i = 3; i < 5; i++) {
			h += pow(2, i) * noise(_i * pow(2, -i), _j * pow(2, -i))
		}
		this.total += h
		return h
	}

	show() {
		this.grid.map((row, i) => row.map((cell, j) => {
			fill(lerpColor(color(66, 105, 47), color(248, 240, 164), 2 * (cell) - 1.2))
			if (cell > .99) {
				fill(72, 181, 224)
			}
			noStroke()
			rect(i * poly, j * poly, poly)
		}))
	}
}