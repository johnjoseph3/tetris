var orientation;
var currentBlockColor ;
var boardColor = 'white';
var isFallSpeedFast = false;
var intervalId;
var slowInterval = 750;
var fastInterval = 250;
var currentBlockCoords = [];
var currentBlockName;
var blockTypes = ['square', 'line'];
var downArrowFired = false;

function drawGrid() {
  var template = _.template(
    "<%_.forEach(gridCoords, function (coord, index) {%>"
    + "<div class='block' data-coords=<%= gridCoords[index]['x'] %>,<%= gridCoords[index]['y'] %> ></div>"
    + "<%})%>"
  );
  $("#output").html( template() );
}

function createBlock() {
  var randomNum = Math.floor(Math.random() * blockTypes.length);
  currentBlockName = blockTypes[randomNum];
  orientation = 'up';
  var blockCoords = blockDimensions[currentBlockName][orientation];
  currentBlockColor = blockColors[currentBlockName]
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
  if ((direction === 'right' && highestX < 10 || direction === 'left' && lowestX > 1) && !isNextBlockFrozen(currentBlockCoordsByHighx, highestX, lowestX, 'horizontal' ,direction)) {
    eraseBlock();
    for (var point in currentBlockCoords) {
      currentBlockCoords[point].x = currentBlockCoords[point].x + distance;
    }
    drawBlock();
  }
}

function isNextBlockFrozen(currentBlockCoordsByHigh, highest, lowest, type, direction) {
  var isNextBlockFrozen = false;

  var filterdBlockCoords = currentBlockCoordsByHigh.filter(function(coord) {
    if (type === 'horizontal') {
      if (direction === 'right') {
        return coord.x === highest;
      } else {
        return coord.x === lowest;
      }
    } else if (type === 'vertical') {
      return coord.y === highest;
    }
  })

  filterdBlockCoords.forEach(function(coord) {
    if (type === 'horizontal') {
      var nextX;
      if (direction === 'right') {
        nextX = coord.x + 1;
      } else {
        nextX = coord.x - 1;
      }
      var nextCoord = nextX + "," + coord.y;
    } else if (type === 'vertical') {
      var nextCoord = coord.x + "," + (coord.y + 1);
    }

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

  if (highestY < 20 && !isNextBlockFrozen(currentBlockCoordsByHighY, highestY, null, 'vertical')) {
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

function isRotationOutOfBounds(newBlockCoords) {
  var isRotationOutOfBounds = false;

  newBlockCoords.forEach(function(coord) {
    if(coord.x < 0 || coord.x > 10) isRotationOutOfBounds = true;
    if(coord.y < 0 || coord.y > 20) isRotationOutOfBounds = true; 
  });

  return isRotationOutOfBounds;
}

function mapCoords(orientation) {
  var origin = currentBlockCoords[1];
  var newOrientationCoords = _.map(blockDimensions[currentBlockName][orientation], _.clone);
  var originX = origin.x;
  var originY = origin.y;

  var newBlockCoords = newOrientationCoords.map(function(coord) {
    if (currentBlockName == 'line') {
      if (orientation === 'right') {
        newCoord = {
          x: originX,
          y: origin.y
        };
        originX++;
        return newCoord;
      } else {
        newCoord = {
            x: origin.x,
            y: originY
          };
        originY++;
        return newCoord;
      }
    }
  });

  if (!isRotationOutOfBounds(newBlockCoords)) {
    eraseBlock();
    currentBlockCoords = newBlockCoords;
    drawBlock();
  }
}

function rotate() {
  if(currentBlockName === 'square') return;
    if (currentBlockName === 'line') {
      switch(orientation) {
      case 'up':
        orientation = 'right';
        mapCoords(orientation);
        break;
      case 'right':
        orientation = 'up';
        mapCoords(orientation);
        break;
    } 
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
      if(!downArrowFired) {
        isFallSpeedFast = true;
        clearInterval(intervalId);
        startInterval();
        downArrowFired = true;
      }
      break
  } 
})

$(document).keyup(function(e){
  switch(e.which) {
     case 40:
      isFallSpeedFast = false;
      clearInterval(intervalId);
      startInterval();
      downArrowFired = false;
      break;
  } 
})

function startInterval() {
  var intervalSpeed = isFallSpeedFast ? fastInterval : slowInterval;
  intervalId = setInterval(function() {
    verticalMove();
  }, intervalSpeed)
}

function init() {
  drawGrid();
  createBlock();
  startInterval();
}

init();