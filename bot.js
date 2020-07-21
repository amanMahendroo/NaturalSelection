class Bot {
	constructor(_w, _h, _m, _a, _s, _b) {
		this.id = ""
		for (var i = 0; i < 10; i++) {
			this.id += chars.charAt(floor(random(chars.length)))
		}
		this.pos = createVector(_w, _h)
		this.vel = p5.Vector.random2D()
		this.acc = createVector(0, 0)
		this.hunger = 0
		this.thirst = 0
		this.urge = 0
		this.dna = new DNA(_m, _a, _s, _b)
		this.partnerDna
		this.target
		this.maxVel = 1
		this.gender = floor(random(2))
		this.age = 0.5
		this.dead = false
		this.pregnant = 0
		this.born()
	}

	show() {
		// Essentials - do life stuff i.e., grow, die, get hungry, get thirsty & slow down in water
		this.dead = this.hunger >= 1 || this.thirst >= 1
		this.age = min(this.age + 0.001, 1)

		if (terrain.grid[floor(this.pos.x / poly)]) {
			if (terrain.grid[floor(this.pos.y /  poly)]) {
				if (terrain.grid[floor(this.pos.x / poly)][floor(this.pos.y / poly)] > 0.99) {
					this.thirst = max(0, this.thirst - 0.01)
					this.maxVel = 0.2
				} else {
					this.maxVel = 1
				}
			}
		}

		this.maxVel /= this.age
		this.thirst = min(1, this.thirst + 0.0001)
		this.hunger = min(this.hunger + 0.001, 1)
		this.pregnant = max(this.pregnant - 1, 0)
		if (this.age > .6 && !this.pregnant) {
			this.urge = min(1, this.urge + 0.001)
		}
		if (this.pregnant == 1) {
			this.reproduce()
			if (random() < 0.25) {
				this.reproduce()
				if (random() < 0.25) {
					this.reproduce()
				}
			}
		}

		// Survival - Look for food & water
		if (this.target) {
			if (this.target.eaten || this.target.pregnant) {
				this.target = undefined
			}
		}
		if (this.target) {
			if (this.target.gender) {
				if (sqDist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) < 2500 && !this.target.pregnant) {
					this.target.target = this
				}
				if (sqDist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) < 100 && !this.target.pregnant) {
					console.log(this.id + " mated with " + this.target.id)
					this.target.pregnant = this.target.dna.birthTime
					this.target.partnerDna = this.dna
					this.urge = 0
					this.target.urge = 0
					this.target.target = undefined
					this.target = undefined
				}
			}
		}

		if (!this.target) {
			if (!this.gender && this.urge > this.hunger && this.urge > this.thirst) {
				let possibleMates = []
				let sum = 0
				bots.map((c) => {
					if (c.gender && !c.pregnant) {
						possibleMates.push(c)
						sum += c.dna.attractiveness
					}
				})
				let sum1 = 0, x = random(sum)
				for (var i = 0; i < possibleMates.length; i++) {
					sum1 += possibleMates[i].dna.attractiveness
					if (sum1 > x) {
						this.target = possibleMates[i]
						break
					}
				}
			} else {
				let possibleFoods = []
				food.map((c) => {
					if (sqDist(this.pos.x, this.pos.y, c.pos.x, c.pos.y) < 2500) {
						possibleFoods.push(c)
					}
				})

				if (possibleFoods.length) {
					this.target = possibleFoods[floor(random(possibleFoods.length))]
				}
			}
		}

		// Reaction - Steer towards food & water or move randomly
		let dir
		if (this.target) {
			dir = this.target.pos
			// this.maxVel *= min(1, sqDist(this.target.x, this.target.y, this.pos.x, this.pos.y) / 2500)
		} else {
			dir = createVector(random(width), random(height))
		}
		
		let desired = p5.Vector.sub(dir, this.pos)
		let steer = p5.Vector.sub(desired, this.vel).setMag(0.1)
		this.pos.add(this.vel.add(steer).setMag(this.maxVel))

		// Get drawn in the environment
		this.draw()
	}

	draw() {
		strokeWeight(2)
		if (this.gender == 1) {
			stroke(205, 153, 124)
			if (this.pregnant) {
				stroke(255, 0, 0)
			}
			fill(255, 203, 164)
		} else {
			stroke(131, 67, 33)	
			fill(181, 101, 33)
		}
		ellipse(this.pos.x, this.pos.y, 20 * this.age)
		ellipse(this.pos.x, this.pos.y + 5 * this.age, 5 * this.age, 1 * this.age)
		fill(255)
		noStroke()
		let offset = createVector(2.5 * this.age * this.vel.x, 2.5 * this.age * this.vel.y)
		ellipse(this.pos.x - 5 * this.age, this.pos.y - 7 * this.age, 10 * this.age)
		ellipse(this.pos.x + 5 * this.age, this.pos.y - 7 * this.age, 10 * this.age)
		fill(0)
		ellipse(this.pos.x - 5 * this.age + offset.x, this.pos.y - 7 * this.age + offset.y, 5 * this.age)
		ellipse(this.pos.x + 5 * this.age + offset.x, this.pos.y - 7 * this.age + offset.y, 5 * this.age)
		stroke(0, 255, 136)
		line(this.pos.x - 10, this.pos.y - 22, this.pos.x - 10 + 20 * this.hunger, this.pos.y - 22)
		stroke(0, 0, 255)
		line(this.pos.x - 10, this.pos.y - 18, this.pos.x - 10 + 20 * this.thirst, this.pos.y - 18)
		stroke(255, 0, 0)
		line(this.pos.x - 10, this.pos.y - 14, this.pos.x - 10 + 20 * this.urge, this.pos.y - 14)
	}

	born() {
		console.log(this.id + " was born at the " + frameCount + "th frame!")
	}

	die() {
		let cause
		if (this.hunger > .99) { 
			cause = "hunger" 
		}
		if (this.thirst > .99) { 
			cause = "thirst" 
		}
		let str = "RIP " + this.id + "\n"
		str += (this.gender) ? "F " : "M "
		str += floor(100 * this.age) + "\n"
		console.log(str + "Cause of death: " + cause)
		// console.log(this)
	}

	reproduce() {
		let a = avg(this.dna.matingUrge, this.partnerDna.matingUrge)
		let b = avg(this.dna.attractiveness, this.partnerDna.attractiveness)
		let c = avg(this.dna.survivability, this.partnerDna.survivability)
		let d = avg(this.dna.birthTime, this.partnerDna.birthTime)

		let x = new Bot(this.pos.x, this.pos.y, a, b, c, d)

		bots.push(x)
	}
}

class DNA {
	constructor(_m, _a, _s, _b) {
		this.matingUrge = _m
		this.gender = floor(random(2))
		this.attractiveness = _a
		this.survivability = _s
		this.birthTime = _b
		this.survivability *= this.birthTime / 600
	}
}

function avg(a, b) {
	return (a + b) / 2
}

function sqDist(a, b, c, d) {
	return (a - c) * (a - c) + (b - d) * (b - d)
}