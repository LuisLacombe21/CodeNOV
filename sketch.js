let tSize = 200; // Tamaño del texto
let tposX = 250; // Posición X del texto
let tposY = 500; // Posición Y del texto
let pointCount = 1; // Densidad de puntos del texto

let speed = 3; // Velocidad de las partículas
let comebackSpeed = 1; // Velocidad de retorno
let dia = 10; // Diámetro de interacción
let randomPos = true; // Posiciones de inicio aleatorias
let pointsDirection = "general"; // Dirección general de movimiento
let interactionDirection = -1; // Dirección de interacción

let textPoints = [];
let words = ["Sand", "Desert", "Storm", "Dust"]; // Palabras para cambiar
let currentWordIndex = 0; // Índice de la palabra actual

// Definir posibles colores y formas geométricas
let colors = ['#ff5733', '#33ff57', '#3357ff', '#f0e130'];
let shapes = ['circle', 'square', 'triangle']; 

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
    tposX = width/2 /  tSize * 1.20
    tposy = height/2 / tSize * 3.50   
  textFont(font);
  createTextPoints();
}

function draw() {
  background(10);

  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

function mousePressed() {
  // Cambiar la palabra, el color y la forma al hacer clic
  currentWordIndex = (currentWordIndex + 1) % words.length;
  createTextPoints(); // Regenerar las partículas con la nueva palabra
  
  // Cambiar color y forma
  for (let i = 0; i < textPoints.length; i++) {
    let shapeIndex = floor(random(shapes.length));
    let colorIndex = floor(random(colors.length));
    textPoints[i].setShape(shapes[shapeIndex], colors[colorIndex]);
  }
}

function createTextPoints() {
  textPoints = []; // Limpiar las partículas anteriores

  let points = font.textToPoints(words[currentWordIndex], tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPoints.push(textPoint);
  }
}

function Interact(x, y, m, d, t, s, di, p) {
  this.home = t ? createVector(random(width), random(height)) : createVector(x, y);
  this.pos = this.home.copy();
  this.target = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 0.1;
  this.dia = d;
  this.come = s;
  this.dir = p;
  
  // Propiedades para el color y la forma
  this.color = '#ffffff'; // Color inicial
  this.shape = 'circle';  // Forma inicial
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  fill(this.color);
  stroke(255);
  strokeWeight(4);

  // Mostrar la partícula en forma de la figura seleccionada
  if (this.shape === 'circle') {
    ellipse(this.pos.x, this.pos.y, this.r * 0.1);
  } else if (this.shape === 'square') {
    rect(this.pos.x - this.r, this.pos.y - this.r, this.r * 2, this.r * 2);
  } else if (this.shape === 'triangle') {
    triangle(
      this.pos.x, this.pos.y - this.r,
      this.pos.x - this.r, this.pos.y + this.r,
      this.pos.x + this.r, this.pos.y + this.r
    );
  }
};

// Función para cambiar el color y la forma
Interact.prototype.setShape = function(shape, color) {
  this.shape = shape;
  

  this.color = color;
};
