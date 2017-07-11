import gridCoords from './gridCoords';
import mapCoords from './mapCoords';
import blockDimensions from './blockDimensions';
import blockColors from './blockColors';
import { isNextBlockFrozen } from './rotate';

const boardColor = '#162944';
const blockTypes = ['square', 'line', 't', 's', 'l'];
const slowInterval = 500;
const fastInterval = 100;

let intervalId;
let currentBlockCoords;
let currentBlockName;
let currentBlockColor;
let orientation;
let isFallSpeedFast = false;
let downArrowFired = false;

const drawGrid = () => {
  var template = _.template(
    "<%_.forEach(gridCoords, function (coord, index) {%>"
    + "<div class='block' frozen='false' state='inactive' x=<%= gridCoords[index]['x'] %> y=<%= gridCoords[index]['y'] %> ></div>"
    + "<%})%>"
  );
  $("#output").html( template({gridCoords}) );
};

const createBlock = () => {
  const randomNum = Math.floor(Math.random() * blockTypes.length);
  currentBlockName = blockTypes[randomNum];
  orientation = 'up';
  const blockCoords = blockDimensions[currentBlockName];
  currentBlockColor = blockColors[currentBlockName];
  currentBlockCoords = _.map(blockCoords, _.clone);
  drawBlock();
};

const drawBlock = () => {
  for (const point in currentBlockCoords) {
    const block = $("div[x='" + currentBlockCoords[point].x + "']["  + " y='" + currentBlockCoords[point].y +  "']");
    block.css('background-color', currentBlockColor);
    block.attr('color', currentBlockColor);
    $("div[x='" + currentBlockCoords[point].x + "']["  + " y='" + currentBlockCoords[point].y +  "']").attr('state', 'active');
  }
};

const freezeBlock = () => {
  for (const point in currentBlockCoords) {
    $("div[x='" + currentBlockCoords[point].x + "']["  + " y='" + currentBlockCoords[point].y +  "']").attr('frozen', 'true');
  }
};

const shiftRowsDown = () => {
  const frozenBlocks = $("div[frozen='true'")
  $(frozenBlocks).css('background-color', boardColor);
  $(frozenBlocks).attr('frozen', false);
  for (const block of frozenBlocks) {
    const y = parseInt($(block).attr('y')) + 1
    const x = $(block).attr('x');
    const nextBlock = $("div[x='" + x + "']["  + " y='" + y +  "']");
    nextBlock.css('background-color', $(block).attr('color'));
    nextBlock.attr('frozen', 'true')
  }
}

const removeFullRows = () => {
  let ys = [];
  for (let coord of currentBlockCoords) {
    ys.push(coord.y);
  }
  ys = _.uniq(ys);

  for (const y of ys) {
    const blocksInRow = $("div[y='" + y + "']");
    let allBlocksAreFrozen = true;
    for (const block of blocksInRow) {
      if ($(block).attr('frozen') !== "true") {
        allBlocksAreFrozen = false;
      }
    }
    if (allBlocksAreFrozen) {
      shiftRowsDown();
    }
  }
};

const eraseBlock = () => {
  for (const point in currentBlockCoords) {
    $("div[x='" + currentBlockCoords[point].x + "']["  + " y='" + currentBlockCoords[point].y +  "']").css('background-color', boardColor);
    $("div[x='" + currentBlockCoords[point].x + "']["  + " y='" + currentBlockCoords[point].y +  "']").attr('state', 'inactive');
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

  if ((direction === 'right' && highestX < 10 || direction === 'left' && lowestX > 1) && !isNextBlockFrozen(currentBlockCoords, 'horizontal' , direction)) {
    eraseBlock();
    for (const point in currentBlockCoords) {
      currentBlockCoords[point].x = currentBlockCoords[point].x + distance;
    }
    drawBlock();
  }
};

const verticalMove = () => {
  const highestY = _.sortBy(currentBlockCoords, (coord) => {
    return +coord.y;
  }).reverse()[0].y;

  if (highestY < 20 && !isNextBlockFrozen(currentBlockCoords, 'vertical')) {
    eraseBlock();
    for (const point in currentBlockCoords) {
      currentBlockCoords[point].y = currentBlockCoords[point].y + 1;
    }
    drawBlock();
  } else {
    freezeBlock();
    removeFullRows();
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

$('.left').click((e) => { horizontalMove('left'); });
$('.right').click((e) => { horizontalMove('right'); });
$('.rotate').click((e) =>{ rotate(); } );
$('.fall-speed-fast').mousedown((e) => {
  isFallSpeedFast = true;
  clearInterval(intervalId);
  startInterval();
})
$('.fall-speed-fast').mouseup((e) => {
  isFallSpeedFast = false;
  clearInterval(intervalId);
  startInterval();
})

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