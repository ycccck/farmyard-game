// reference tutorial: Beginner's Guide: Make things move with keyboard input in P5js; https://www.youtube.com/watch?v=MA_aFQV9vss
// reference tutorial How to create collisions, walls, and barriers in the P5.js programming language; https://www.youtube.com/watch?v=JV5XBmaQdIA
// extend the collison system using chatGPT
// images and assets from https://itch.io/game-assets Sprout Land

let player;
let land;
let house;
let char1;
let char2;
let char3;
let item1;
let item2;
let item3;
let obstacles = [];
let items = [];

function preload() {
  land = loadImage("land.png");
  house = loadImage("house.png");
  char1 = loadImage("cat.png");
  char2 = loadImage("cow.png");
  char3 = loadImage("hen.png");
  item1 = loadImage("heart.png");
  item2 = loadImage("milk.png");
  item3 = loadImage("egg.png");
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent("farmyard");
  player = new Player(width / 2, 200);

  // obstacles
  obstacles.push(new Obstacle(355, 160, 30, 320));
  obstacles.push(new Obstacle(150, 90, 200, 60));
  obstacles.push(new Obstacle(175, 135, 15, 40));
  obstacles.push(new Obstacle(275, 260, 150, 30));
  obstacles.push(new Obstacle(290, 300, 110, 40));
  obstacles.push(new Obstacle(110, 345, 40, 60));
  obstacles.push(new Obstacle(110, 445, 30, 20));
  obstacles.push(new Obstacle(220, 445, 30, 20));
  obstacles.push(new Obstacle(465, 240, 30, 20));
  obstacles.push(new Obstacle(210, 470, 5, 15));
  obstacles.push(new Obstacle(260, 600, 30, 320));
  obstacles.push(new Obstacle(310, 700, 100, 50));
  obstacles.push(new Obstacle(125, 560, 30, 20));
  obstacles.push(new Obstacle(520, 520, 65, 65));
  obstacles.push(new Obstacle(545, 150, 30, 240));
  obstacles.push(new Obstacle(545, 380, 30, 70));
  obstacles.push(new Obstacle(665, 400, 200, 30));
  obstacles.push(new Obstacle(680, 450, 100, 100));
  obstacles.push(new Obstacle(635, 500, 45, 40));
  obstacles.push(new Obstacle(635, 530, 10, 20));
  obstacles.push(new Obstacle(485, 130, 80, 80));
  obstacles.push(new Obstacle(650, 100, 200, 50));
  obstacles.push(new Obstacle(610, 140, 15, 30));
  obstacles.push(new Obstacle(665, 175, 10, 10));
  obstacles.push(new Obstacle(700, 680, 60, 60));
  obstacles.push(new Obstacle(420, 670, 20, 15));
  obstacles.push(new Obstacle(480, 710, 5, 20));
  // house
  obstacles.push(new Obstacle(120, 600, 60, 60));
  obstacles.push(new Obstacle(650, 265, 60, 50));
  obstacles.push(new Obstacle(540, 585, 60, 50));

  // create random item positions for charater to collide
  createItems();
}

function draw() {
  background(0);
  imageMode(CENTER);
  land.resize(width, height);
  image(land, width / 2, height / 2);

  // house door locations
  ellipse(120, 640, 20, 20);
  ellipse(650, 300, 20, 20);
  ellipse(550, 620, 20, 20);

  house.resize(100, 100);
  image(house, 120, 620);

  house.resize(100, 100);
  image(house, 650, 280);

  house.resize(100, 100);
  image(house, 540, 600);

  // resize characters
  char1.resize(35, 35);
  char2.resize(50, 35);
  char3.resize(35, 35);
  
  // resize objects for pickup
  item1.resize(25, 25);
  item2.resize(25, 25);
  item3.resize(25, 25);

  // call player
  player.update();
  player.draw();

  // show items
  for (let item of items) {
    item.draw();
  }

  // check for collisions with items
  colliItem();
}

  // create 2 of each item and place them outside obstacles
function createItems() {
  let itemPositions = [];
  
  while (itemPositions.length < 6) {
    let newItem = createVector(random(150, 650), random(150, 600));
    let validPosition = true;

    // check if the item is inside the obstacle's bounding box
    for (let obstacle of obstacles) {
      if (
        newItem.x > obstacle.x - obstacle.w / 2 && // item is to the right of the obstacle's left side
        newItem.x < obstacle.x + obstacle.w / 2 && // item is to the left of the obstacle's right side
        newItem.y > obstacle.y - obstacle.h / 2 && // item is below the obstacle's top side
        newItem.y < obstacle.y + obstacle.h / 2    // item is above the obstacle's bottom side
      ) {
        validPosition = false;
        break;
      }
    }

    // check if the item is placed out of bounds (not within 100px from the edge)
    if (newItem.x < 100 || newItem.x > width - 100 || newItem.y < 100 || newItem.y > height - 100) {
      validPosition = false;
    }

    if (validPosition) {
      itemPositions.push(newItem);
    }
  }

  // create items at the valid positions
  items.push(new Item(itemPositions[0].x, itemPositions[0].y, item1)); 
  items.push(new Item(itemPositions[1].x, itemPositions[1].y, item1));
  items.push(new Item(itemPositions[2].x, itemPositions[2].y, item2)); 
  items.push(new Item(itemPositions[3].x, itemPositions[3].y, item2));  
  items.push(new Item(itemPositions[4].x, itemPositions[4].y, item3));  
  items.push(new Item(itemPositions[5].x, itemPositions[5].y, item3)); 
}


  // for each item, check if player collides with it and handle according to character type
function colliItem() {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    let distToItem = dist(player.x, player.y, item.x, item.y);

    if (distToItem < player.radius + 10) {
      if (player.player === char1 && item.image === item1) {

        items.splice(i, 1);  // Remove the obj1 item
      } else if (player.player === char2 && item.image === item2) {

        items.splice(i, 1);  
      } else if (player.player === char3 && item.image === item3) {
        items.splice(i, 1);  
      }
    }
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.radius = 20;
    this.player = char1;
  }

  update() {
    // create a vector "mvmt" for direction
    let mvmt = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW)) {
      mvmt.x -= 1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      mvmt.x += 1;
    }
    if (keyIsDown(UP_ARROW)) {
      mvmt.y -= 1;
    }
    if (keyIsDown(DOWN_ARROW)) {
      mvmt.y += 1;
    }

    // set vector's magnitude to speed
    mvmt.setMag(this.speed);
    let newX = this.x + mvmt.x;
    let newY = this.y + mvmt.y;

    // check collison
    if (!this.collides(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // check for collision with house doors to change character
    this.colliDoor(newX, newY);

    // set boundaries
    if (this.x < 100) {
      this.x = 100;
    }
    if (this.x > width - 100) {
      this.x = width - 100;
    }
    if (this.y < 100) {
      this.y = 100;
    }
    if (this.y > height - 100) {
      this.y = height - 100;
    }
  }

  collides(x, y) {
    for (let obstacle of obstacles) {
      if (
        x + this.radius > obstacle.x - obstacle.w / 2 &&
        x - this.radius < obstacle.x + obstacle.w / 2 &&
        y + this.radius > obstacle.y - obstacle.h / 2 &&
        y - this.radius < obstacle.y + obstacle.h / 2
      ) {
        return true;
      }
    }
    return false;
  }

  // check collision with doors to change character
  colliDoor(newX, newY) {
    // door 1 (ellipse at (120, 640))
    if (dist(newX, newY, 120, 640) < 20) {
      this.player = char1; 
    }
    // door 2 (ellipse at (650, 300))
    if (dist(newX, newY, 650, 300) < 20) {
      this.player = char2; 
    }
    // door 3 (ellipse at (550, 620))
    if (dist(newX, newY, 550, 620) < 20) {
      this.player = char3; 
    }
  }

  // draw the current character
  draw() {
    image(this.player, this.x, this.y);
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class Item {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  draw() {
    image(this.image, this.x, this.y);
  }
}