import blockColors from './blockColors';
import gridCoords from './gridCoords';
import blockDimensions from './blockDimensions';
import { isNextBlockFrozen } from './rotate';
import mapCoords from './mapCoords';

const boardColor = 'white';
const blockTypes = ['line'];
const slowInterval = 500;
const fastInterval = 100;

let isFallSpeedFast = false;
let intervalId;
let currentBlockCoords;
let currentBlockName;
let currentBlockColor;
let orientation;
let downArrowFired = false;

const drawGrid = () => {
  var template = _.template(
    "<%_.forEach(gridCoords, function (coord, index) {%>"
    + "<div class='block' data-coords=<%= gridCoords[index]['x'] %>,<%= gridCoords[index]['y'] %> ></div>"
    + "<%})%>"
  );
  $("#output").html( template({gridCoords}) );
};

const createBlock = () => {
  const randomNum = Math.floor(Math.random() * blockTypes.length);
  currentBlockName = blockTypes[randomNum];
  orientation = 'up';
  const blockCoords = blockDimensions[currentBlockName][orientation];
  currentBlockColor = blockColors[currentBlockName];
  currentBlockCoords = _.map(blockCoords, _.clone);
  drawBlock();
};

const drawBlock = () => {
  for (const point in currentBlockCoords) {
    const coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', currentBlockColor);
  }
};

const freezeBlock = () => {
  for (const point in currentBlockCoords) {
    const coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").attr('frozen', 'true');
  }
};

const eraseBlock = () => {
  for (const point in currentBlockCoords) {
    const coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', boardColor);
  }
};

const horizontalMove = (direction) => {
  let distance;
  direction === 'right' ? distance = 1 : distance = -1;
  const currentBlockCoordsByHighx = _.sortBy(currentBlockCoords, function(coord) { 
    return +coord.x;
  }).reverse();
  const highestX = currentBlockCoordsByHighx[0].x;
  const lowestX = currentBlockCoordsByHighx[currentBlockCoordsByHighx.length - 1].x;

  if ((direction === 'right' && highestX < 10 || direction === 'left' && lowestX > 1) && !isNextBlockFrozen(currentBlockCoordsByHighx, highestX, lowestX, 'horizontal' ,direction)) {
    eraseBlock();
    for (const point in currentBlockCoords) {
      currentBlockCoords[point].x = currentBlockCoords[point].x + distance;
    }
    drawBlock();
  }
};

const verticalMove = () => {
  const currentBlockCoordsByHighY = _.sortBy(currentBlockCoords, (coord) => {
    return +coord.y;
  }).reverse();
  const highestY = currentBlockCoordsByHighY[0].y;

  if (highestY < 20 && !isNextBlockFrozen(currentBlockCoordsByHighY, highestY, null, 'vertical')) {
    eraseBlock();
    for (const point in currentBlockCoords) {
      currentBlockCoords[point].y = currentBlockCoords[point].y + 1;
    }
    drawBlock();
  } else {
    freezeBlock();
    createBlock();
  }
};

const rotate = () => {
  if(currentBlockName === 'square') return;
  switch(orientation) {
  case 'up':
    orientation = 'right';
    break;
  case 'right':
    orientation = 'down';
    break;
  case 'down':
    orientation = 'left';
    break;
  case 'left':
    orientation = 'up';
    break;
  }

  const newBlockCoords = mapCoords(currentBlockCoords, currentBlockName, orientation);
  if (newBlockCoords) {
    eraseBlock();
    currentBlockCoords = newBlockCoords;
    drawBlock();
  }
};

$(document).keydown((e) => {
  switch(e.which) {
  case 37:
    horizontalMove('left');
    break;
  case 38:
    rotate();
    break;
  case 39:
    horizontalMove('right');
    break;
  case 40:
    if(!downArrowFired) {
      isFallSpeedFast = true;
      clearInterval(intervalId);
      startInterval();
      downArrowFired = true;
    }
    break;
  } 
});

$(document).keyup((e) => {
  switch(e.which) {
  case 40:
    isFallSpeedFast = false;
    clearInterval(intervalId);
    startInterval();
    downArrowFired = false;
    break;
  } 
});

const startInterval = () => {
  const intervalSpeed = isFallSpeedFast ? fastInterval : slowInterval;
  intervalId = setInterval(function() {
    verticalMove();
  }, intervalSpeed);
};

const init = () => {
  drawGrid();
  createBlock();
  startInterval();
};

init();