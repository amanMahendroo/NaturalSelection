function setup() {
	createCanvas(700, 700)
	foodSlider = createSlider(0, 1, 0.2, 0.01)
	foodSlider.style('background', 'red')
	terrain = new Terrain(Math.ceil(width / poly), Math.ceil(height / poly))
	bots = new Array(5).fill(0)
	bots = bots.map(() => new Bot(random(width), random(height), random(), random(), random(), floor(random(180, 600))))
	food = new Array(50).fill(0)
	food = food.map(() => new Food(width, height))
	ellipseMode(CENTER)
}

let bots, food, terrain, poly = 32, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', alpha = 2
let foodSlider

function draw() {
	terrain.show()
	bots.map((c) => c.show())
	food.map((c) => c.show())
	textSize(20)
	fill(30, 39, 44)
	text("Population: " + bots.length, width - 200, 50)
	if (random() < foodSlider.value()) {
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
	if (bots.length == 1) {
		let c = bots[0]
		let str = 'Last surviving bunny: <b>'
		str += c.id + ', '
		str += (c.gender) ? "F " : "M "
		str += floor(100 * c.age) + "</b><br />"
		str += 'Attractiveness: <b>' + round(c.dna.attractiveness * 100) / 100 + '</b><br />'
		str += 'Survivability: <b>' + round(c.dna.survivability * 100) / 100 + '</b><br />'
		str += 'Birth Time: <b>' + c.dna.birthTime + '</b> frames<br />'
		newUpdate(str, 'black')
		noLoop()
	}
}