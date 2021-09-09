let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

let context = canvas.getContext("2d");



let game = false;
let castType = undefined;

let resizeFillRectX = undefined;
let resizeFillRectY = undefined;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  x = window.innerWidth - 275;
  y = window.innerHeight - 410;
  dx = 5;
  dy = 30;
  init();
});

canvas.addEventListener("click", function () {
  game = !game;
});

function Cloud(x, y, xVelocity) {
  this.x = x;
  this.y = y;
  this.xVelocity = xVelocity;

  this.draw = () => {
    let randomCloud = this.randomImage()
    console.log(randomCloud, "hellooooooo")
    
     // Create an image object. This is not attached to the DOM and is not part of the page.
     var image = new Image();

     // When the image has loaded, draw it to the canvas
     image.onload = function()
     {
        context.drawImage(image, x, y)
     }
 
     // Now set the source of the image that we want to load
     image.src = randomCloud;
  }

  this.update = () => {
    if (this.x  > innerWidth - 2 || this.x < 0) {
      this.xVelocity = -this.xVelocity;
    }

    this.x += this.xVelocity;

    this.draw();
  }

  this.randomImage = () => {
    return './assets/Cloud' + Math.floor(Math.random() * 20 + 1).toString() + '.png'
  } 
}

// fishing rod init
context.beginPath();
context.moveTo(window.innerWidth - 200, window.innerHeight - 200);
context.lineTo(window.innerWidth - 280, window.innerHeight - 300);
context.strokeStyle = "black";
context.stroke();

function fishing(castType) {
  // if (!castType) {
  //   return
  // }
  this.castType = castType;
  context.save();
  console.log(x, y);
  context.translate(x + 1 / 2, x + 1 / 2);
  context.rotate(5 * (Math.PI / 180));
  context.translate(-(x + 1 / 2), -(x + 1 / 2));

  // THIS IS THE STUFF YOU WANT ROTATED
  // do whatever it is you need to do here, moveto and lineto is all i used
  // I would expect anything to work. use normal grid coordinates as if its a
  // normal 0,0 in the top left kind of grid

  context.beginPath();
  context.moveTo(window.innerWidth - 200, window.innerHeight - 200);
  context.lineTo(window.innerWidth - 280, window.innerHeight - 300);
  console.log(this.rightOrLeftStrengthBar, "Strength")
  this.resizeFillRectX = x;
  this.resizeFillRectY = y;
  if (castType === "super") {
    context.lineTo(40, window.innerHeight - 50);
    context.strokeStyle = "black";
    context.stroke();
  } else if (castType === "regular") {
    context.lineTo(140, window.innerHeight - 50);
    context.strokeStyle = "black";
    context.stroke();
  } else if (castType === "poor") {
    context.lineTo(280, window.innerHeight - 100);
    context.strokeStyle = "black";
    context.stroke();
  } 
  context.stroke();
  context.restore();
}

function init() {
  
  // cloud init
  cloudArray = [];
  for (let i = 0; i < 21; i++) {
    let x = Math.random() * (innerWidth);
    let y = Math.random() * (innerHeight - 300);
    let xVelocity = (Math.random() - 0.5) * 5;
    cloudArray.push(new Cloud(x, y, xVelocity));
  }

  // casting reinit
  if (this.castType === "super") {
    console.log(x, y, "hello")
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(this.resizeFillRectX, this.resizeFillRectY, dx, dy);
    
    fishing("super");
  } else if (this.castType === "regular") {
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(this.resizeFillRectX, this.resizeFillRectY, dx, dy);
    
    fishing("regular");
  } else if (this.castType === "poor") {
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(this.resizeFillRectX, this.resizeFillRectY, dx, dy);
    
    fishing("poor");
  }


  // green
  context.fillStyle = "rgba(108, 239, 57, 1)";
  context.fillRect(window.innerWidth - 200, window.innerHeight - 400, 20, 10);

  // orange
  context.fillStyle = "rgba(239, 136, 57, 1)";
  context.fillRect(window.innerWidth - 180, window.innerHeight - 400, 30, 10);
  context.fillRect(window.innerWidth - 230, window.innerHeight - 400, 30, 10);

  // red
  context.fillStyle = "rgba(219, 0, 18, 1)";
  context.fillRect(window.innerWidth - 150, window.innerHeight - 400, 40, 10);
  context.fillRect(window.innerWidth - 270, window.innerHeight - 400, 40, 10);

  // visuals

  // ocean
  context.fillStyle = "rgba(0, 0, 255, 0.8)";
  context.fillRect(0, window.innerHeight - 200, window.innerWidth - 300, 200);

  // grass
  context.globalCompositeOperation='destination-over';
  context.fillStyle = "rgba(124, 252, 0, 1)";
  context.fillRect(window.innerWidth - 300, window.innerHeight - 200, 300, 200);

  // sky
  context.globalCompositeOperation='destination-over';
  context.fillStyle = "rgba(135, 206, 250, .5)"
  context.fillRect(0, 0, window.innerWidth, window.innerHeight - 200);
}

let x = window.innerWidth - 275;
let y = window.innerHeight - 410;
let dx = 5;
let dy = 30;

function animate() {
  
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   action
  //   context.rect(window.innerWidth - 280, window.innerHeight - 410, 180, 30);
  requestAnimationFrame(animate);
  console.log(game)
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (game) {
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(x, y, dx, dy);
    if (x > window.innerWidth - 105 || x < window.innerWidth - 275) {
      dx = -dx;
      console.log(dx);
    }

    x += dx;
    fishing(false);
  }

  // should happen all the time
  for (let i = 0; i < cloudArray.length; i++) {
    cloudArray[i].update();
  }

  if (!game) {
    if (x >= window.innerWidth - 200 && x <= window.innerWidth - 200 + 20) {
      console.log("super cast");
      this.rightOrLeftStrengthBar = undefined;
      fishing("super");
    } else if (
      (x >= window.innerWidth - 180 && x <= window.innerWidth - 180 + 30) ||
      (x > window.innerWidth - 230 && x < window.innerWidth - 230 + 30)
    ) {
      fishing("regular")
    } else {
      fishing("poor")
    }
    init()
    return;
  }
  console.log("hello");
  init()
}

init();
animate()
