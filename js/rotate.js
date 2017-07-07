import blockDimensions from './blockDimensions';

const isRotationOutOfBounds = (newBlockCoords) => {
  let isRotationOutOfBounds = false;

  console.log(newBlockCoords)

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

export { isNextBlockFrozen , isRotationOutOfBounds, isRotationHittingFrozenBlock };