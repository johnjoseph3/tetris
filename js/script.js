var currentBlockColor = 'red';
var boardColor = 'white';
var isFallSpeedFast = false;
var intervalId;
var slowInterval = 750;
var fastInterval = 250;
var currentBlockCoords = [];
var blockTypes = ['square'];

function drawGrid() {
  var template = _.template(
    "<%_.forEach(gridCoords, function (coord, index) {%>"
    + "<div class='block' data-coords=<%= gridCoords[index]['x'] %>,<%= gridCoords[index]['y'] %> ></div>"
    + "<%})%>"
  );
  $("#output").html( template() );
}

function createBlock() {
  // TODO: Make the array index a random number within blockTypes length.
  var blockCoords = blockDimensions[blockTypes[0]];
  currentBlockCoords = _.map(blockCoords, _.clone);
  drawBlock();
}

function drawBlock() {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', currentBlockColor);
  }
}

function freezeBlock() {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").attr('frozen', 'true');
  }
}

function eraseBlock() {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', boardColor);
  }
}

function horizontalMove(direction) {
  var distance;
  direction === 'right' ? distance = 1 : distance = -1;
  var currentBlockCoordsByHighx = _.sortBy(currentBlockCoords, function(coord) { 
    return +coord.x;
  }).reverse();
  var highestX = currentBlockCoordsByHighx[0].x;
  var lowestX = currentBlockCoordsByHighx[currentBlockCoordsByHighx.length - 1].x;
  if ((direction === 'right' && highestX < 10 || direction === 'left' && lowestX > 1) && !isNextHorizontalBlockFrozen(currentBlockCoordsByHighx, highestX, lowestX, direction)) {
    eraseBlock();
    for (var point in currentBlockCoords) {
      currentBlockCoords[point].x = currentBlockCoords[point].x + distance;
    }
    drawBlock();
  }
}

function isNextHorizontalBlockFrozen(currentBlockCoordsByHighx, highestX, lowestX, direction) {
  var isNextBlockFrozen = false;

  var filterdBlockCoordsByX = currentBlockCoordsByHighx.filter(function(coord) {
    if (direction === 'right') {
      return coord.x === highestX;
    } else {
      return coord.x === lowestX;
    }
  })

  filterdBlockCoordsByX.forEach(function(coord) {
    var nextX;
    if (direction === 'right') {
      nextX = coord.x + 1;
    } else {
      nextX = coord.x - 1;
    }
    var nextCoord = nextX + "," + coord.y;
    var nextBlock = $("div[data-coords='" + nextCoord + "']");
    if(nextBlock.attr('frozen')) {
      isNextBlockFrozen = true;
    }
  })

  return isNextBlockFrozen;
}

function isNextVerticalBlockFrozen(currentBlockCoordsByHighY, highestY) {
  var isNextBlockFrozen = false;

  var filterdBlockCoordsByHighY = currentBlockCoordsByHighY.filter(function(coord) {
    return coord.y === highestY;
  })

  filterdBlockCoordsByHighY.forEach(function(coord) {
    var nextCoord = coord.x + "," + (coord.y + 1);
    var nextBlock = $("div[data-coords='" + nextCoord + "']");
    if(nextBlock.attr('frozen')) {
      isNextBlockFrozen = true;
    }
  })
  return isNextBlockFrozen;
}

function verticalMove() {
  var currentBlockCoordsByHighY = _.sortBy(currentBlockCoords, function(coord) { 
    return +coord.y;
  }).reverse();
  var highestY = currentBlockCoordsByHighY[0].y;

  if (highestY < 20 && !isNextVerticalBlockFrozen(currentBlockCoordsByHighY, highestY)) {
    eraseBlock();
    for (var point in currentBlockCoords) {
      currentBlockCoords[point].y = currentBlockCoords[point].y + 1;
    }
    drawBlock();
  } else {
    freezeBlock();
    createBlock();
  }
}

function rotate() {
  var activeBlockContainer = $('.active-block');
  switch(orientation) {
    case 'down':
      orientation = 'left';
      break;
    case 'left':
      orientation = 'up';
      break;
     case 'up':
      orientation = 'right';
      break;
     case 'right':
      orientation = 'down';
      break;
  } 
}

$(document).keydown(function(e){
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
      isFallSpeedFast = !isFallSpeedFast;
      clearInterval(intervalId);
      startInterval();
      break;
  } 
})

function startInterval() {
  var intervalSpeed = isFallSpeedFast ? fastInterval : slowInterval;
  intervalId = setInterval(function() {
    verticalMove()
  }, intervalSpeed)
}

function init() {
  drawGrid();
  createBlock();
  startInterval();
}

init();