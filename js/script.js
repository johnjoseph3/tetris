var orientation = 'down';
var activeBlock = {
  templateName: '',
  height: 0,
  width: 0,
  verticalHeight: 0,
  horizontalHeight: 0,
  verticalWidth: 0,
  horizontalWidth: 0
}
var isFallSpeedFast = false;
var fallSpeedFast = 4;
var fallSpeedSlow = 2;

function rotate() {
  var activeBlockContainer = $('.active-block');
  switch(orientation) {
    case 'down':
      activeBlockContainer.find($('.t')).hide();
      activeBlockContainer.find($('.t-left')).show();
      orientation = 'left';
      activeBlock.height = activeBlock.verticalHeight;
      activeBlock.width = activeBlock.verticalWidth;
      break;
    case 'left':
      activeBlockContainer.find($('.t')).hide();
      activeBlockContainer.find($('.t-up')).show();
      orientation = 'up';
      activeBlock.height = activeBlock.horizontalHeight;
      activeBlock.width = activeBlock.horizontalWidth;
      break;
     case 'up':
      activeBlockContainer.find($('.t')).hide();
      activeBlockContainer.find($('.t-right')).show();
      orientation = 'right';
      activeBlock.height = activeBlock.verticalHeight;
      activeBlock.width = activeBlock.verticalWidth;
      break;
     case 'right':
      activeBlockContainer.find($('.t')).hide();
      activeBlockContainer.find($('.t-down')).show();
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

function freezeBlock() {
  var inactiveBlock = $('.active-block');
  inactiveBlock.removeClass('active-block');
  createNewBlock();
}

function start() {
  setInterval(function(){
    var activeBlockContainer = $('.active-block');
    currentTop = activeBlockContainer.position().top;
    var top;

    if (currentTop + activeBlock.height >= $('#game-board').height()) {
      freezeBlock();
      return
    };

    if (isFallSpeedFast) {
      top = currentTop + fallSpeedFast;
    } else {
      top = currentTop + fallSpeedSlow;
    }
    activeBlockContainer.css('top', top);
  }, 50);
}

function createNewBlock() {
  activeBlock = new Block();
  var template = _.template( $('#' + activeBlock.templateName).text() );
  $("#output").append( template({activeClass: 'active-block'}) );
}

$('.start').click(function() {
  createNewBlock();
  start();
})