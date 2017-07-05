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

function horizontalMove(direction) {
  var activeBlockContainer = $('.active-block');
  var leftPosition = activeBlockContainer.position().left;
  if(direction === 'right') {
    if (leftPosition < $('#game-board').width() - activeBlock.width) {
      activeBlockContainer.css('left', leftPosition + 25);
    }
  } else {
    if (leftPosition > $('#game-board')[0].offsetLeft) {
      activeBlockContainer.css('left', activeBlockContainer.position().left - 25);
    }
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

function isTouchingInactiveBlock() {
  // inactiveBlockCoords.forEach(function(coords) {

  // });
}

function buildInactiveBlockCoords(position) {
  var coords = position;
  inactiveBlockCoords.push(coords);
}

function freezeBlock() {
  var inactiveBlock = $('.active-block');
  buildInactiveBlockCoords(inactiveBlock.position())
  inactiveBlock.removeClass('active-block');
  createNewBlock();
}

function start() {
  // setInterval(function(){
  //   var activeBlockContainer = $('.active-block');
  //   var test = document.getElementsByClassName('active-block');
  //   currentTop = activeBlockContainer.position().top;
  //   var top;
  //   var activeBlockHeight = activeBlockContainer.find($('.rect-long'));
  //   if (currentTop + activeBlock.height >= $('#game-board').height() || isTouchingInactiveBlock()) {
  //     freezeBlock();
  //     return
  //   };

  //   if (isFallSpeedFast) {
  //     top = currentTop + fallSpeedFast;
  //   } else {
  //     top = currentTop + fallSpeedSlow;
  //   }
  //   activeBlockContainer.css('top', top);
  // }, 50);
}

function createNewBlock() {
  activeBlock = new Block();
  var template = _.template( $('#' + activeBlock.templateName).text() );
  $("#output").append( template({activeClass: 'active-block'}) );
}

$('.start').click(function() {
  // createNewBlock();
  start();
})

function drawGrid() {
  var template = _.template(
      "<%_.forEach(gridCoords, function (coord, index) {%>"
      + "<div class='block' data-coords=<%= gridCoords[index]['x'] %>,<%= gridCoords[index]['y'] %> ></div>"
      + "<%})%>"
  );
  $("#output").html( template() );
}

function eraseBlockCoords(callback) {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', 'white');
  }
  setTimeout(function() {
    callback()
  }, 0)
  // callback();
}

function drawBlock(callback) {
  for (var point in currentBlockCoords) {
    var coord = currentBlockCoords[point].x + ',' + currentBlockCoords[point].y;
    $("div[data-coords='" + coord + "']").css('background-color', 'red');
  }
  
}

function updateBlockPosition() {
  eraseBlockCoords(drawBlock);
  for (var point in currentBlockCoords) {
    // currentBlockCoords[point].x = currentBlockCoords[point].x + 1;
    currentBlockCoords[point].y = currentBlockCoords[point].y + 1;
  }
}

function startInterval() {
  setInterval(function() {
    updateBlockPosition()
  }, 750)
}

function createBlock() {
  // Make this Random
  blockTypes = ['square '];
  currentBlockCoords = blockDimensions['square'];
  drawBlock();
}

function init() {
  drawGrid();
  createBlock();
  startInterval();
}

init();