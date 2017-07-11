import blockDimensions from './blockDimensions';

const isRotationOutOfBounds = (newBlockCoords) => {
  let isRotationOutOfBounds = false;

  newBlockCoords.forEach((coord) => {
    if(coord.x < 1 || coord.x > 10) isRotationOutOfBounds = true;
    if(coord.y < 0 || coord.y > 20) isRotationOutOfBounds = true; 
  });

  return isRotationOutOfBounds;
}

const isRotationHittingFrozenBlock = (newBlockCoords) => {
  let isRotationHittingFrozenBlock = false;

  if (isNextBlockFrozen(newBlockCoords, 'vertical') ||
      isNextBlockFrozen(newBlockCoords, 'horizontal'))
    {
      isRotationHittingFrozenBlock = true;
    }
  return isRotationHittingFrozenBlock;
}

const isNextBlockFrozen = (currentBlockCoords, type, direction) => {
  let isNextBlockFrozen = false;
  
  currentBlockCoords.forEach( (coord) => {
    let nextX;
    let nextY;
    if (type === 'horizontal') {
      if (direction === 'right') {
        nextX = coord.x + 1;
      } else {
        nextX = coord.x - 1;
      }
      nextY = coord.y
    } else if (type === 'vertical') {
      nextX = coord.x;
      nextY = coord.y + 1
    }

    const nextBlock = $("div[x='" + nextX + "']["  + " y='" + nextY + "']");
    
    if(nextBlock.attr('frozen') === "true") {
      isNextBlockFrozen = true;
    }
  })

  return isNextBlockFrozen;
}

export { isNextBlockFrozen , isRotationOutOfBounds, isRotationHittingFrozenBlock };