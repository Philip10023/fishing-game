let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

let context = canvas.getContext("2d");

let infoModal = true;

let theCast = false;
let castType = undefined;
let firstCast = true;
let firstClick = false;
let casting = false;
let timer = false;
let time = 59;
let score = 0;
let keyLog = "";
let keyArray = ["w", "a", "s", "d"];
let currentLetter = undefined;
let sequence = [];
let fishingState = "idle";
let fishCaught = [];
let fishTracker = 0;
let fishHooked = false;
let fish = undefined;
let fishAnimate = false;
let afterInSequence = "";
let gameEnded = false;

let xChangeTracking = 0;

let resizeFillRectX = undefined;
let resizeFillRectY = undefined;

// 0 rare / 15%
// 1 normal / 30%
// 2 poor / 55%
let weightedProbablity = [
  0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
];

// 2 point
let deadFish1 = { el: document.getElementById("deadFish1"), points: 2 };
let deadFish2 = { el: document.getElementById("deadFish2"), points: 2 };
// 10 points
let greenFish = { el: document.getElementById("greenFish"), points: 10 };
// 20 points
let redFish = { el: document.getElementById("redFish"), points: 20 };
// 40 points
let blueFish = { el: document.getElementById("blueFish"), points: 40 };
// 100 points
let pufferFish = { el: document.getElementById("pufferFish"), points: 100 };
let eel = { el: document.getElementById("eel"), points: 100 };

let poorTable = [
  redFish,
  greenFish,
  Math.random() > 0.5 ? deadFish1 : deadFish2,
];

let regularTable = [blueFish, redFish, greenFish];

let superTable = [Math.random() > 0.5 ? pufferFish : eel, blueFish, redFish];

let number0 = document.getElementById("number0");
let number1 = document.getElementById("number1");
let number2 = document.getElementById("number2");
let number3 = document.getElementById("number3");
let number4 = document.getElementById("number4");
let number5 = document.getElementById("number5");
let number6 = document.getElementById("number6");
let number7 = document.getElementById("number7");
let number8 = document.getElementById("number8");
let number9 = document.getElementById("number9");
let plusSign = document.getElementById("plusSign");
let colon = document.getElementById("colon");

let numberArray = [
  number0,
  number1,
  number2,
  number3,
  number4,
  number5,
  number6,
  number7,
  number8,
  number9,
];

let letterW = document.getElementById("letterW");
let letterA = document.getElementById("letterA");
let letterS = document.getElementById("letterS");
let letterD = document.getElementById("letterD");

let cloud1 = document.getElementById("cloud1");
let cloud2 = document.getElementById("cloud2");
let cloud3 = document.getElementById("cloud3");
let cloud4 = document.getElementById("cloud4");
let cloud5 = document.getElementById("cloud5");
let cloud6 = document.getElementById("cloud6");
let cloud7 = document.getElementById("cloud7");
let cloud8 = document.getElementById("cloud8");
let cloud9 = document.getElementById("cloud9");
let cloud10 = document.getElementById("cloud10");
let cloud11 = document.getElementById("cloud11");
let cloud12 = document.getElementById("cloud12");
let cloud13 = document.getElementById("cloud13");
let cloud14 = document.getElementById("cloud14");

let cloudImageArray = [];

cloudImageArray.push(
  cloud1,
  cloud2,
  cloud3,
  cloud4,
  cloud5,
  cloud6,
  cloud7,
  cloud8,
  cloud9,
  cloud10,
  cloud11,
  cloud12,
  cloud13,
  cloud14
);

let modal = document.getElementById("modal");

let gameEndedModal = document.getElementById("modal-game-ended");

let endScore = document.getElementById("score");

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resizeFillRectX = x;
  resizeFillRectY = y;
  x = window.innerWidth - 275 + xChangeTracking;
  y = window.innerHeight - 410;
  dx = 5;
  dy = 30;
  init();
});

document.addEventListener("keypress", function (e) {
  if (fishHooked) {
    keyLog = e.key.toLowerCase();
    sequenceUsage();
  }
});

canvas.addEventListener("click", function () {
  if (firstClick === false) {
    firstClick = true;
  }
  if (fishingState === "idle") {
    fishingState = "casting";
  }
  if (fishingState === "casting") {
    fishingState = "idleAfterCasting";
  }
  if (fishHooked === true) {
  } else {
    theCast = !theCast;
    casting = true;
  }
  console.log(casting, "CHANGE");
});

modal.addEventListener("click", function () {
  infoModal = false;
});

modal.addEventListener("keypress", function () {
  infoModal = false;
});

function Cloud(x, y, xVelocity, image) {
  this.x = x;
  this.y = y;
  this.xVelocity = xVelocity;
  this.image = image;

  this.draw = () => {
    context.drawImage(this.image, this.x, this.y);
  };

  this.update = () => {
    if (this.x > innerWidth - 2 || this.x < -500) {
      this.xVelocity = -this.xVelocity;
    }
    this.x += this.xVelocity;

    this.draw();
  };
}

randomImage = () => {
  return (
    "./assets/Cloud" + Math.floor(Math.random() * 20 + 1).toString() + ".png"
  );
};

// cloud init
let cloudArray = [];
for (let i = 0; i <= 16; i++) {
  let x = Math.random() > 0.5 ? 0 : window.innerWidth - 200;
  let y = Math.random() * (innerHeight - 600) + 70;

  let randomNum = Math.random();
  randomNum > 0.05 || randomNum < -0.05
    ? (randomNum = randomNum)
    : (randomNum += 1.5);

  let xVelocity = (randomNum - 0.5) * 1.5;
  let image = cloudImageArray[Math.floor(Math.random() * 13)];

  cloudArray.push(new Cloud(x, y, xVelocity, image));
}

function fishing(castTypeParam) {
  castType = castTypeParam;
  context.save();
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

  resizeFillRectX = x;
  resizeFillRectY = y;
  if (castType === "super") {
    context.lineTo(50, window.innerHeight);
    context.strokeStyle = "black";
    context.stroke();
    if (!fishHooked && casting) {
      catchFish("super");
    }
  } else if (castType === "regular") {
    context.lineTo(250, window.innerHeight - 20);
    context.strokeStyle = "black";
    context.stroke();
    if (!fishHooked && casting) {
      catchFish("regular");
    }
  } else if (castType === "poor") {
    context.lineTo(
      window.innerWidth < 1000 ? 400 : 800,
      window.innerHeight - 50
    );
    context.strokeStyle = "black";
    context.stroke();
    if (!fishHooked && casting) {
      catchFish("poor");
    }
  }
  context.stroke();
  context.restore();
}

function randomIndexForWASD() {
  let randLetterIndex = Math.floor(Math.random() * 4);
  if (sequence[sequence.length - 1] == keyArray[randLetterIndex]) {
    return randomIndexForWASD();
  } else {
    return randLetterIndex;
  }
}

function randomWASD(castType, randFish) {
  if (castType === "super") {
    if (randFish === 0) {
      for (let i = 0; i < 12; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 1) {
      for (let i = 0; i < 10; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 2) {
      for (let i = 0; i < 8; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
  } else if (castType === "regular") {
    if (randFish === 0) {
      for (let i = 0; i < 10; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 1) {
      for (let i = 0; i < 8; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 2) {
      for (let i = 0; i < 6; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
  } else {
    if (randFish === 0) {
      for (let i = 0; i < 8; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 1) {
      for (let i = 0; i < 6; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
    if (randFish === 2) {
      for (let i = 0; i < 4; i++) {
        sequence.push(keyArray[randomIndexForWASD()]);
      }
    }
  }
  return sequence;
}

function randomFish() {
  return weightedProbablity[Math.floor(Math.random() * 19)];
}

function catchFish(castType) {
  fishHooked = true;
  let randFish = randomFish();
  if (castType === "super") {
    fish = superTable[randFish];

    sequence = randomWASD(castType, randFish);
    sequenceUsage();
  } else if (castType === "regular") {
    fish = regularTable[randFish];

    sequence = randomWASD(castType, randFish);
    sequenceUsage();
  } else {
    fish = poorTable[randFish];

    sequence = randomWASD(castType, randFish);
    sequenceUsage();
  }
}

function sequenceUsage() {
  // should also add some kind of timer for losing a fish
  // also too many incorrect choices should lose fish
  console.log(sequence);
  if (sequence.length === 0) {
    if (!gameEnded) {
      fishCaught.push(fish);
    }

    console.log("should not");
    fishHooked = false;
    theCast = false;
    castType = undefined;
    console.log(castType);
    casting = false;
    fishingState = "idle";

    if (gameEnded) {
      firstCast = true;
      time = 59;
      score = 0;
      gameEnded = false;
      currentLetter.style.visibility = "hidden";
      timer = false;
      init();
    }
    return;
  }

  let nextInSequence = sequence[sequence.length - 1];

  if (nextInSequence === "w") {
    currentLetter = letterW;
    letterW.style.visibility = "visible";
    letterW.classList.add("bounce");
  } else if (nextInSequence === "a") {
    currentLetter = letterA;
    letterA.style.visibility = "visible";
    letterA.classList.add("bounce");
  } else if (nextInSequence === "s") {
    currentLetter = letterS;
    letterS.style.visibility = "visible";
    letterS.classList.add("bounce");
  } else if (nextInSequence === "d") {
    currentLetter = letterD;
    letterD.style.visibility = "visible";
    letterD.classList.add("bounce");
  }
  if (keyLog === "") {
    return;
  }

  if (keyLog === nextInSequence) {
    sequence.pop();
    keyLog = "";
    if (nextInSequence === "w") {
      // display html element
      letterW.classList.remove("bounce");
      letterW.style.visibility = "hidden";
    } else if (nextInSequence === "a") {
      letterA.classList.remove("bounce");
      letterA.style.visibility = "hidden";
    } else if (nextInSequence === "s") {
      letterS.classList.remove("bounce");
      letterS.style.visibility = "hidden";
    } else if (nextInSequence === "d") {
      letterD.classList.remove("bounce");
      letterD.style.visibility = "hidden";
    }

    sequenceUsage();
  }
}

function gameTimer() {
  var sec = 00;
  timer = true;
  let interval = setInterval(function () {
    if (sec == 00) {
      sec = 59;
    }
    sec--;
    time = sec;
    if (sec === 0) {
      timer = false;
      // open game over modal
      endScore.textContent = score.toString();
      gameEndedModal.style.visibility = "visible";
      gameEnded = true;
      sequence = [];
      sequenceUsage();
      setTimeout(() => {
        gameEndedModal.addEventListener("click", function () {
          gameEndedModal.style.visibility = "hidden";
          // gameEnded = true;
          // sequence = [];
          // sequenceUsage();
          clearInterval(interval);
        });
        gameEndedModal.addEventListener("keypress", function () {
          gameEndedModal.style.visibility = "hidden";
          // gameEnded = true;
          // sequence = [];
          // sequenceUsage();
          clearInterval(interval);
        });
      }, 2000);
      return;
    }
  }, 1000);
}

// fishing rod init
context.beginPath();
context.moveTo(window.innerWidth - 200, window.innerHeight - 200);
context.lineTo(window.innerWidth - 280, window.innerHeight - 300);
context.strokeStyle = "black";
context.stroke();

function init() {
  // info modal

  if (infoModal) {
    modal.style.visibility = "visible";
  } else {
    modal.style.visibility = "hidden";
  }

  // visuals

  // score
  if (fishCaught < 1) {
    context.drawImage(number0, 540, 20);
    context.drawImage(number0, 580, 20);
    context.drawImage(number0, 620, 20);
    context.drawImage(number0, 660, 20);
    context.drawImage(number0, 700, 20);
  }

  // timer init
  if (!timer) {
    context.drawImage(number1, 80, 20);
    context.drawImage(colon, 120, 20);
    context.drawImage(number0, 160, 20);
    context.drawImage(number0, 200, 20);
  }

  if (casting === false) {
    // fishing rod init
    context.beginPath();
    context.moveTo(window.innerWidth - 200, window.innerHeight - 200);
    context.lineTo(window.innerWidth - 280, window.innerHeight - 300);
    context.strokeStyle = "black";
    context.stroke();
  }
  // casting reinit
  // Having trouble reinitializing the strength bar
  // uses x and when x is resized the bar is set to left poor
  // need a better way to find the old position
  if (castType === "super") {
    console.log("SUPER ");
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(resizeFillRectX, resizeFillRectY, dx, dy);

    fishing("super");
  } else if (castType === "regular") {
    console.log("REG ");
    context.fillStyle = "rgba(219, 0, 18, 1)";

    fishing("regular");
  } else if (castType === "poor") {
    console.log("poor ");
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(resizeFillRectX, resizeFillRectY, dx, dy);
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
  context.fillRect(window.innerWidth - 150, window.innerHeight - 400, 50, 10);
  context.fillRect(window.innerWidth - 280, window.innerHeight - 400, 50, 10);

  // dock
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "rgba(164,116,73, .9)";
  // width - 36.7%
  // context.fillRect(window.innerWidth - window.innerWidth * 0.367, window.innerHeight - 170, 800, 200);
  context.fillRect(
    window.innerWidth - window.innerWidth * 0.2,
    window.innerHeight - 180,
    800,
    200
  );

  // sky
  // context.globalCompositeOperation = "destination-over";
  context.fillStyle = "rgba(135, 206, 250, .5)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight - 140);

  // new sky addition maybe
  // context.globalCompositeOperation = "destination-over";
  // context.fillStyle = "rgba(191, 191, 191, 1)"
  // context.fillRect(0, 0, window.innerWidth, window.innerHeight)
}

function numberDecider(placement) {
  let stringScore = score.toString();
  let numberDecided = parseInt(stringScore[placement - 1]);
  return numberArray[numberDecided];
}

function fishYDecider() {
  console.log(window.innerWidth);
  if (window.innerWidth < 1000) {
    return window.innerHeight - 750;
  } else if (window.innerWidth < 1400) {
    return window.innerHeight - 600;
  } else {
    return window.innerHeight - 550;
  }
}

let fishX = 5;
let fishY = fishYDecider();
let fishDx = 0.5;
let fishDy = 0.5;

let x = window.innerWidth - 275;
let y = window.innerHeight - 410;
let dx = 5;
let dy = 30;

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, innerWidth, innerHeight);

  if (theCast) {
    context.fillStyle = "rgba(219, 0, 18, 1)";
    context.fillRect(x, y, dx, dy);
    if (x > window.innerWidth - 105 || x < window.innerWidth - 275) {
      dx = -dx;
    }

    xChangeTracking += dx;
    x += dx;
    fishing(false);
  }

  if (fishCaught.length > 0 && fishCaught.length !== fishTracker) {
    score += fishCaught[fishCaught.length - 1].points;
    fishCaught[fishCaught.length - 1].el.style.visibility = "visible";
    fishAnimate = true;
    fishTracker++;
  }

  if (fishAnimate === true) {
    // context.drawImage(fishCaught[fishCaught.length - 1].el, fishX, fishY)
    fishCaught[fishCaught.length - 1].el.style.left = fishX + fishDx + "%";
    fishX += fishDx;
    if (fishX >= 45) {
      fishCaught[fishCaught.length - 1].el.style.top = fishY - fishDy + "%";
      fishY += fishDy;
    } else {
      fishCaught[fishCaught.length - 1].el.style.top = fishY + fishDy + "%";
      fishY -= fishDy;
    }
    if (fishX >= 90) {
      fishCaught[fishCaught.length - 1].el.style = "hidden";
      fishX = 5;
      fishY = fishYDecider();
      fishDx = 0.5;
      fishDy = 0.5;
      fishAnimate = false;
    }
  }

  if (score >= 10000) {
    context.drawImage(numberDecider(5), 540, 20);
    context.drawImage(numberDecider(4), 580, 20);
    context.drawImage(numberDecider(3), 620, 20);
    context.drawImage(numberDecider(2), 660, 20);
    context.drawImage(numberDecider(1), 700, 20);
  } else if (score >= 1000) {
    context.drawImage(number0, 540, 20);
    context.drawImage(numberDecider(4), 580, 20);
    context.drawImage(numberDecider(3), 620, 20);
    context.drawImage(numberDecider(2), 660, 20);
    context.drawImage(numberDecider(1), 700, 20);
  } else if (score >= 100) {
    context.drawImage(number0, 540, 20);
    context.drawImage(number0, 580, 20);
    context.drawImage(numberDecider(1), 620, 20);
    context.drawImage(numberDecider(2), 660, 20);
    context.drawImage(numberDecider(3), 700, 20);
  } else if (score >= 10) {
    context.drawImage(number0, 540, 20);
    context.drawImage(number0, 580, 20);
    context.drawImage(number0, 620, 20);
    context.drawImage(numberDecider(1), 660, 20);
    context.drawImage(numberDecider(2), 700, 20);
  } else if (score > 0) {
    context.drawImage(number0, 540, 20);
    context.drawImage(number0, 580, 20);
    context.drawImage(number0, 620, 20);
    context.drawImage(number0, 660, 20);
    context.drawImage(numberDecider(1), 700, 20);
  } else {
    context.drawImage(number0, 540, 20);
    context.drawImage(number0, 580, 20);
    context.drawImage(number0, 620, 20);
    context.drawImage(number0, 660, 20);
    context.drawImage(number0, 700, 20);
  }

  for (let i = 0; i < cloudArray.length; i++) {
    cloudArray[i].update();
  }

  if (timer) {
    let stringTime = time.toString();
    if (stringTime.length < 2) {
      context.drawImage(number0, 80, 20);
      context.drawImage(colon, 120, 20);
      context.drawImage(number0, 160, 20);
      context.drawImage(numberArray[stringTime[0]], 200, 20);
    } else {
      context.drawImage(number0, 80, 20);
      context.drawImage(colon, 120, 20);
      context.drawImage(numberArray[stringTime[0]], 160, 20);
      context.drawImage(numberArray[stringTime[1]], 200, 20);
    }
  }

  if (firstCast === true && theCast) {
    console.log("TIMER ON");
    firstCast = false;
    gameTimer();
    fishing(false);
    init();
    return;
  }

  // if (!game && firstClick ) {
  if (!theCast && firstClick && fishingState === "idleAfterCasting") {
    if (x >= window.innerWidth - 200 && x <= window.innerWidth - 200 + 20) {
      fishing("super");
    } else if (
      (x >= window.innerWidth - 180 && x <= window.innerWidth - 180 + 30) ||
      (x >= window.innerWidth - 230 && x <= window.innerWidth - 230 + 30)
    ) {
      fishing("regular");
    } else if (
      (x >= window.innerWidth - 150 && x <= window.innerWidth - 150 + 50) ||
      (x >= window.innerWidth - 280 && x <= window.innerWidth - 280 + 50)
    ) {
      fishing("poor");
    }
    init();
    return;
  }
  init();
}

init();
animate();

// WASD game
