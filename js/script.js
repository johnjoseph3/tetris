// var orientation = 'right';
// var activeBlock = {
//   templateName: '',
//   height: 0,
//   width: 0,
//   verticalHeight: 0,
//   horizontalHeight: 0,
//   verticalWidth: 0,
//   horizontalWidth: 0
// }
// var isFallSpeedFast = false;
// var fallSpeedFast = 4;
// var fallSpeedSlow = 2;
// var inactiveBlockCoords = [];
var currentBlockColor = 'red';
var boardColor = 'white';
var currentBlockCoords;

function rotate() {
  var activeBlockContainer = $('.active-block');
  switch(orientation) {
    case 'down':
      activeBlockContainer.find($('.rect-long')).attr({width: 25, height: 75, x: 25});
      activeBlockContainer.find($('.rect-short')).attr({width: 25, height: 25, x: 0, y: 25});
      orientation = 'left';
      activeBlock.height = activeBlock.verticalHeight;
      activeBlock.width = activeBlock.verticalWidth;
      break;
    case 'left':
      activeBlockContainer.find($('.rect-long')).attr({width: 75, height: 25, x: 0, y: 25});
      activeBlockContainer.find($('.rect-short')).attr({width: 25, height: 25, x: 25, y: 0});
      orientation = 'up';
      activeBlock.height = activeBlock.horizontalHeight;
      activeBlock.width = activeBlock.horizontalWidth;
      break;
     case 'up':
      activeBlockContainer.find($('.rect-long')).attr({width: 25, height: 75, x: 0, y: 0});
      activeBlockContainer.find($('.rect-short')).attr({width: 25, height: 25, x: 25, y: 25});
      orientation = 'right';
      activeBlock.height = activeBlock.verticalHeight;
      activeBlock.width = activeBlock.verticalWidth;
      break;
     case 'right':
      activeBlockContainer.find($('.rect-long')).attr({width: 75, height: 25});
      activeBlockContainer.find($('.rect-short')).attr({width: 25, height: 25});
      orientation = 'down';
      activeBlock.height = activeBlock.horizontalHeight;
      activeBlock.width = activeBlock.horizontalWidth;
      break;
  } 
}

$(document).keydown(function(e){
  if(e.which === 37) {
    horizontalMove('left');
  }
  if(e.which === 38) {
    rotate();
  }
  if(e.which === 39) {
    horizontalMove('right');
  }
  if(e.which === 40) {
    isFallSpeedFast = !isFallSpeedFast;
  }
})


function drawGrid() {
  var template = _.template(
      "<%_.forEach(gridCoords, function (coord, index) {%>"
      + "<div class='block' data-coords=<%= gridCoords[index]['x'] %>,<%= gridCoords[index]['y'] %> ></div>"
      + "<%})%>"
  );
  $("#output").html( template() );
}

function eraseBlock() {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', boardColor);
  }
}

function drawBlock() {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', currentBlockColor);
  }
}

function horizontalMove(direction) {
  var distance;
  var allXs = [];
  direction === 'right' ? distance = 1 : distance = -1;
  for (var point in currentBlockCoords) {
    allXs.push(currentBlockCoords[point].x);
  }
  allXs = _.sortBy(allXs, function(num) {
    return num;
  });
  var lowestX = allXs[0];
  var highestX = allXs.reverse()[0];
  if (direction === 'right' && highestX < 10 || direction === 'left' && lowestX > 1) {
    eraseBlock();
    for (var point in currentBlockCoords) {
      currentBlockCoords[point].x = currentBlockCoords[point].x + distance;
    }
    drawBlock();
  }
}

function verticalMove() {
  var allYs = [];
  for (var point in currentBlockCoords) {
    allYs.push(currentBlockCoords[point].y);
  }
  allYs = _.sortBy(allYs, function(num) {
    return num;
  });
  var highestY = allYs.reverse()[0];
  if (highestY < 20) {
    eraseBlock();
    for (var point in currentBlockCoords) {
      currentBlockCoords[point].y = currentBlockCoords[point].y + 1;
    }
    drawBlock();
  }
}

function startInterval() {
  setInterval(function() {
    verticalMove()
  }, 750)
}

function createBlock() {
  var blockTypes = ['square'];
  currentBlockCoords = blockDimensions[blockTypes[0]];
  drawBlock();
}

function init() {
  drawGrid();
  createBlock();
  startInterval();
}

init();