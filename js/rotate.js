import blockDimensions from './blockDimensions';

const  mapCoords = (currentBlockCoords, currentBlockName, orientation) => {
  const origin = currentBlockCoords[1];
  const newOrientationCoords = _.map(blockDimensions[currentBlockName][orientation], _.clone);
  let originX = origin.x;
  let originY = origin.y;

  const newBlockCoords = newOrientationCoords.map(function(coord) {
    if (currentBlockName == 'line') {
      if (orientation === 'right') {
        let newCoord = {
          x: originX,
          y: origin.y
        };
        originX++;
        return newCoord;
      } else {
        let newCoord = {
            x: origin.x,
            y: originY
          };
        originY++;
        return newCoord;
      }
    }
  });

  if (!isRotationOutOfBounds(newBlockCoords) && !isRotationHittingFrozenBlock(newBlockCoords)) {
    return newBlockCoords;
  } else {
    return false;
  }
}

const isRotationOutOfBounds = (newBlockCoords) => {
  let isRotationOutOfBounds = false;

  newBlockCoords.forEach(function(coord) {
    if(coord.x < 0 || coord.x > 10) isRotationOutOfBounds = true;
    if(coord.y < 0 || coord.y > 20) isRotationOutOfBounds = true; 
  });

  return isRotationOutOfBounds;
}

function isRotationHittingFrozenBlock(newBlockCoords) {
  let isRotationHittingFrozenBlock = false;

  const newBlockCoordsByHighX = _.sortBy(newBlockCoords, function(coord) { 
    return +coord.x;
  }).reverse();
  const highestX = newBlockCoordsByHighX[0].x;
  const lowestX = newBlockCoordsByHighX[newBlockCoordsByHighX.length - 1].x;

  const newBlockCoordsByHighY = _.sortBy(newBlockCoords, function(coord) { 
    return +coord.y;
  }).reverse();
  const highestY = newBlockCoordsByHighY[0].y;

  if (isNextBlockFrozen(newBlockCoordsByHighY, highestY, null, 'vertical') ||
      isNextBlockFrozen(newBlockCoordsByHighX, highestX, lowestX, 'horizontal'))
    {
      isRotationHittingFrozenBlock = true;
    }
  return isRotationHittingFrozenBlock;
}

const isNextBlockFrozen = (currentBlockCoordsByHigh, highest, lowest, type, direction) => {
  let isNextBlockFrozen = false;

  const filterdBlockCoords = currentBlockCoordsByHigh.filter( (coord) => {
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

  filterdBlockCoords.forEach( (coord) => {
    let nextCoord;
    if (type === 'horizontal') {
      let nextX;
      if (direction === 'right') {
        nextX = coord.x + 1;
      } else {
        nextX = coord.x - 1;
      }
      nextCoord = nextX + "," + coord.y;
    } else if (type === 'vertical') {
      nextCoord = coord.x + "," + (coord.y + 1);
    }

    const nextBlock = $("div[data-coords='" + nextCoord + "']");
    if(nextBlock.attr('frozen')) {
      isNextBlockFrozen = true;
    }
  })

  return isNextBlockFrozen;
}

export { isNextBlockFrozen, mapCoords };