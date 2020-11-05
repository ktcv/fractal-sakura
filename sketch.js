const size = 150
const maxLevel = 12
const rot = 0.37
const lenRand = 0.8
const branchProb = 0.95
const rotRand = 0.2
const flowerProb = 0.67
const mutating = true
let startRand = Math.random() / 2
let randSeed = Math.floor(Math.random() * 1000)
let paramSeed = Math.floor(Math.random() * 1000)
let randBias = 0
let prog = 1
let growing = true

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function rand() {
  return random(1000) / 1000
}

function rand2() {
  return random(2000) / 1000 - 1
}

function rrand() {
  return rand2() + randBias
}

function startGrow() {
  growing = true
  prog = 1
  grow()
}

function mousePressed() {
  startRand = Math.random() / 2
  randSeed = Math.floor(Math.random() * 1000)
  paramSeed = Math.floor(Math.random() * 1000)
  startGrow()
}

function grow() {
  if (prog > maxLevel + 3) {
    prog = maxLevel + 3
    loop()
    growing = false
    return
  }

  let startTime = millis()
  loop()
  let diff = millis() - startTime

  prog += ((maxLevel / 8) * Math.max(diff, 20)) / 1000
  setTimeout(grow, Math.max(1, 20 - diff))
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)

  mutate()

  startGrow()
}

function mutate() {
  if (!mutating) return

  let startTime = millis()
  randomSeed(paramSeed)

  let n = noise(startTime / 12000) - 0.5

  randBias = 4 * Math.abs(n) * n

  paramSeed = 1000 * random()
  randomSeed(randSeed)

  let diff = millis() - startTime

  if (diff < 20) setTimeout(mutate, 20 - diff)
  else setTimeout(mutate, 1)
}

function draw() {
  stroke(245)

  background(24)
  translate(width / 4 + width * startRand, height + 15)
  scale(1, -1)

  translate(0, 20)

  branch(1, randSeed)
}

function branch(level, seed) {
  if (prog < level) return

  randomSeed(seed)

  let seed1 = random(1000),
    seed2 = random(1000)

  let growthLevel = prog - level > 1 || prog >= maxLevel + 1 ? 1 : prog - level

  strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2))

  let len = growthLevel * size * (1 + rand2() * lenRand)

  line(0, 0, 0, len / level)
  translate(0, len / level)

  let doBranch1 = prog <= 2 ? true : rand() < branchProb
  let doBranch2 = prog <= 2 ? true : rand() < branchProb

  let doFlower = rand() < flowerProb

  if (level < maxLevel) {
    let r1 = rot * (1 + rrand() * rotRand)
    let r2 = -rot * (1 - rrand() * rotRand)

    if (doBranch1) {
      push()
      rotate(r1)
      branch(level + 1, seed1)
      pop()
    }
    if (doBranch2) {
      push()
      rotate(r2)
      branch(level + 1, seed2)
      pop()
    }
  }

  if ((level >= maxLevel || (!doBranch1 && !doBranch2)) && doFlower) {
    let p = Math.min(1, Math.max(0, prog - level))

    let flowerSize = (size / 100) * p * (1 / 6) * (len / level)

    strokeWeight(1)
    stroke(207, 70, 70)

    rotate(-PI)
    for (let i = 0; i <= 8; i++) {
      line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()))
      rotate((2 * PI) / 8)
    }
  }
}
