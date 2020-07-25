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
		for (var i = 3; i < 4; i++) {
			h += pow(2, i) * noise(_i * pow(2, -i), _j * pow(2, -i))
		}
		this.total += h
		return h
	}

	show() {
		noStroke()
		for (var i = 0; i < this.grid.length-1; i++) {
			for (var j = 0; j < this.grid[i].length-1; j++) {
				let cell = this.grid[i][j]
				fill(lerpColor(color(66, 105, 47), color(248, 240, 164), 2 * (cell) - 1.2))
				if (cell > .99) {
					fill(72, 181, 224)
				}
				rect(i * poly, j * poly, poly)
			}
		}
	}
}