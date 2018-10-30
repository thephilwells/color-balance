var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//setup
var w = 600;
var h = 500;
var bSize = 50;
var currentPs = [];
var goalPs = [];

//colors
var colors = [
  "#D80034",
  "#FEA756",
  "#34A374",
  "#C8FCFF"
]
var currentColor = colors[0];

//state
var isMouseDown;

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
  adjustWidths("goal", goals)
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

function brush(x, y) {
  ctx.fillStyle = currentColor;
  // ctx.beginPath();
  // ctx.arc(x, y, 25, 0, Math.PI*2);
  // ctx.fill();
  ctx.fillRect(x-25, y-25,bSize,bSize);
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
  adjustWidths("current", currentPs);
}

function adjustWidths(which, amountsArray) {
  for(var i = 0; i < amountsArray.length; i++) {
    var cn = "."+which+" .indicator" + (i + 1);
    document.querySelector(cn).style.width = (amountsArray[i]) + "%";
  }
}

function checkForWin() {
  var wm = document.querySelector(".win-message");
  var allWithin = true;
  for(var i = 0; i < 4; i++) {
    var tolerance = 5;
    if( Math.abs( currentPs[i] - goalPs[i] ) > tolerance ) {
      allWithin = false;
    }
  }
  if(allWithin) {
    console.log("totes match");
    wm.classList.remove("hidden");
    wm.innerHTML = "Match!";
    setTimeout(function (e) {
      wm.classList.add("hidden");
    }, 1000)
    goalPs = generateRandomGoals();
  } else {
    console.log("no match! ----");
    console.log(currentPs);
    console.log(goalPs);
  }
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
    drawCorners();
    brush(e.offsetX, e.offsetY);
  }
})

document.addEventListener("mouseup", function(){ 
  checkForWin();
  isMouseDown = false;
});

document.addEventListener("keydown", function (e) {
  if(e.keyCode == 32) {
    goalPs = generateRandomGoals();
  }
})

ctx.fillStyle = "#555";
ctx.fillRect(0,0,w,h);
drawCorners();
goalPs = generateRandomGoals();
setInterval(checkPercentage,300);
