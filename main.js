
//setup
var w = document.querySelector(".main").offsetWidth;
var h = 300;
var bSize = 30;
var currentPs = [];
var goalPs = [];

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width = w;
c.height = h;

//colors
var colors = [
  "#ffffff",
  "#3d1591",
  "#F7C924",
  "#F96C6C"
]
var currentColor = colors[0];

//state
var isMouseDown;
var timer = 0;
var timerTick;
var level = 1;

function tick() {
  timer+=1;
  if(timer > 60) {
    clearTimeout(timerTick);
    endGame();
  } else {
    document.querySelector(".time-remaining").innerHTML = (60 - timer) + "s";
  }
}

function generateRandomGoals() {
  var g = [];
  for(var i = 0; i < 3; i++) {
    g.push(Math.floor(Math.random() * 92));
  }
  g.sort((a,b)=>a-b);
  g.push(92);
  g.unshift(0);
  var goals = [];
  for(var i = 0; i < g.length-1; i++) {
    goals.push( g[i+1] - g[i] );
  }
  goals = goals.map(e => e+2);

  //set widths of things
  adjustBars("goal", goals)
  return goals;
}

function hexToDecimal(colorString) {
  var red = colorString.substring(1,3);
  return parseInt(red, 16);
}

function drawCorners() {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0,0,bSize,bSize);
  ctx.fillStyle = colors[1];
  ctx.fillRect(w-bSize,0,bSize,bSize);
  ctx.fillStyle = colors[2];
  ctx.fillRect(0,h-bSize,bSize,bSize);
  ctx.fillStyle = colors[3];
  ctx.fillRect(w-bSize,h-bSize,bSize,bSize);
}

function drawQuadrants() {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0,0,w/2,h/2);
  ctx.fillStyle = colors[1];
  ctx.fillRect(w/2,0,w/2,h/2);
  ctx.fillStyle = colors[2];
  ctx.fillRect(0,h/2,w/2,h/2);
  ctx.fillStyle = colors[3];
  ctx.fillRect(w/2,h/2,w/2,h/2);
}

function brush(x, y) {
  var bs = bSize;
  ctx.fillStyle = currentColor;
  // ctx.beginPath();
  // ctx.arc(x, y, 25, 0, Math.PI*2);
  // ctx.fill();
  ctx.save();
  ctx.translate(x,y);
  for(var i = 0; i < 500; i++) {
    ctx.fillRect(Math.floor(Math.random()*(bs))-bs/2,Math.floor(Math.random()*(bs))-bs/2,1,1);
  }
  ctx.restore();
}

function squareBrush(x, y) {
  var bs = bSize;
  ctx.fillStyle = currentColor;
  ctx.save();
  ctx.translate(x,y);
  ctx.fillRect(-bs/2,-bs/2,bs,bs);
  ctx.restore();
}

function checkPercentage() {
  var reds = colors.map(c => hexToDecimal(c));
  var counts = [0,0,0,0];
  var imgd = ctx.getImageData(0,0,w,h);
  for(var i = 0; i <= imgd.data.length; i += 4) {
    for(var j = 0; j < 4; j++) {
      if(imgd.data[i] == reds[j]) {
        counts[j]++;
      }
    }
  }
  currentPs = counts.map(x => (x / (w*h))*100);
  adjustBars("current", currentPs);
}

function adjustBars(which, amountsArray) {
  for(var i = 0; i < amountsArray.length; i++) {
    var cn = "."+which+" .indicator" + (i + 1);
    document.querySelector(cn).style.width = (amountsArray[i]) + "%";
  }
}

function checkForWin() {
  var allWithin = true;
  var offBy = 0;
  for(var i = 0; i < 4; i++) {
    var tolerance = 5;
    let diff = Math.abs( currentPs[i] - goalPs[i] );
    offBy += diff;
    if( diff > tolerance ) {
      allWithin = false;
    }
  }
  if(allWithin) {
    console.log("off by: "+offBy);
    matchAnimation();
    levelUp();
    goalPs = generateRandomGoals();
  }
}

function levelUp() {
  console.log(level);
  console.log("level up");
  document.querySelector(".level").innerHTML = ++level;
}

function matchAnimation() {
  var wm = document.querySelector(".win-message");
  var ms = document.querySelector(".match-screen");
  wm.classList.remove("hidden");
  wm.innerHTML = "Match!";
  // ms.classList.add("up");
  setTimeout(function (e) {
    wm.classList.add("hidden");
  }, 1000)
  // setTimeout(function (e) {
  //   ms.classList.remove("up");
  // }, 300)
}

function endGame() {
  document.querySelector(".end-screen").classList.remove("hidden");
  document.querySelector(".score").innerHTML = level;
  var imgData = c.toDataURL("image/png");
  document.querySelector(".final-image").src = imgData;
}

document.addEventListener("mousedown", function(e){
  if(e.target == c) {
    var eyedrop = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    currentColor = "rgb("+eyedrop.data[0]+","+eyedrop.data[1]+","+eyedrop.data[2]+")";
  }
  isMouseDown = true;
})

c.addEventListener('mousemove', function(e){
  if(isMouseDown) {
    //drawCorners();
    squareBrush(e.offsetX, e.offsetY);
  }
})

document.addEventListener("mouseup", function(){
  checkForWin();
  isMouseDown = false;
});

document.addEventListener("keydown", function (e) {
  var kc = document.querySelector(".keyboard-controls");
  switch(e.keyCode) {
    case 65: //a
      currentColor = colors[0];
      kc.querySelector("p:nth-child(1)").classList.add("down");
    break;
    case 83: //s
      currentColor = colors[1];
      kc.querySelector("p:nth-child(2)").classList.add("down");
    break;
    case 68: //d
      currentColor = colors[2];
      kc.querySelector("p:nth-child(3)").classList.add("down");
    break;
    case 70: //f
      currentColor = colors[3];
      kc.querySelector("p:nth-child(4)").classList.add("down");
    break;
  }
  isMouseDown = true;
})

document.addEventListener("keyup", function (e) {
  var kc = document.querySelector(".keyboard-controls");
  switch(e.keyCode) {
    case 65: //a
      kc.querySelector("p:nth-child(1)").classList.remove("down");
      checkForWin();
    break;
    case 83: //s
      kc.querySelector("p:nth-child(2)").classList.remove("down");
      checkForWin();
    break;
    case 68: //d
      kc.querySelector("p:nth-child(3)").classList.remove("down");
      checkForWin();
    break;
    case 70: //f
      kc.querySelector("p:nth-child(4)").classList.remove("down");
      checkForWin();
    break;
  }
  isMouseDown = false;
})

document.querySelector(".start-screen button").addEventListener("click", function(e) {
  document.querySelector(".start-screen").classList.add("hidden");
  timerTick = setInterval(tick,1000);
})

ctx.fillStyle = "#2d2d2d";
ctx.fillRect(0,0,w,h);
// drawCorners();
drawQuadrants();
goalPs = generateRandomGoals();
setInterval(checkPercentage,300);
