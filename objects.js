class Food {
	constructor(_w, _h) {
		let x = random(20, _w - 20), y = random(20, _h - 20)
		while (terrain.grid[Math.floor(x / poly)][Math.floor(y / poly)] > .99) {
			x = random(_w)
			y = random(_h)
		}
		this.pos = createVector(x, y)
		this.eaten = false
	}

	show() {
		bots.map((c) => {
			if (sqDist(this.pos.x, this.pos.y, c.pos.x, c.pos.y) < 25) {
				this.eaten = true
				c.hunger = max(c.hunger - .2, 0)
			}
		})

		fill(0, 255, 136)
		noStroke()
		ellipse(this.pos.x, this.pos.y, 5)
	}
}