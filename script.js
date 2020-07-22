function setup() {
	createCanvas(700, 700)
	terrain = new Terrain(Math.ceil(width / poly), Math.ceil(height / poly))
	bots = new Array(5).fill(0)
	bots = bots.map(() => new Bot(random(width), random(height), random(), random(), random(), floor(random(180, 600))))
	food = new Array(50).fill(0)
	food = food.map(() => new Food(width, height))
	ellipseMode(CENTER)
}

let bots, food, terrain, poly = 32, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function draw() {
	terrain.show()
	bots.map((c) => c.show())
	food.map((c) => c.show())
	if (random() < 0.2) {
		food.push(new Food(width, height))
	}
	for (var i = 0; i < food.length; i++) {
		if (food[i].eaten) {
			food.splice(i, 1)
		}
	}
	for (var i = 0; i < bots.length; i++) {
		if (bots[i].dead) {
			bots[i].die()
			bots.splice(i, 1)
		}
	}
}