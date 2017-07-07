import blockDimensions from './blockDimensions';
import { isRotationOutOfBounds, isRotationHittingFrozenBlock } from './rotate';

const  mapCoords = (currentBlockCoords, currentBlockName, orientation) => {
  const origin = currentBlockCoords[1];
  const newOrientationCoords = _.map(blockDimensions[currentBlockName][orientation], _.clone);
  let originX = origin.x;
  let originY = origin.y;

  const newBlockCoords = newOrientationCoords.map((coord, index) => {

    if (currentBlockName === 'line') {
      let newCoord = {
          x: originX,
          y: origin.y
        };
      if (orientation === 'right' || orientation === 'left') {
        originX++;
      } else {
        originY++;
      }
      return newCoord;
    }

    if (currentBlockName === 't') {
      let newCoord = {
          x: originX,
          y: originY
        };
      if (orientation === 'right') {
        if (index === 2 || index === 3) {
          originX++;
          originY--;
        } else {
          originY++;
        }
      } else if (orientation === 'down') {
        if (index === 2 || index === 2) {
          originX--;
          originY++;
        } else {
          originX++;
        }
      } else if (orientation === 'left') {
        if (index === 2 || index === 2) {
          originX--;
          originY++;
        } else {
          originY--;
        }
      } else if (orientation === 'up') {
        if (index === 2 || index === 2) {
          originX++;
          originY--;
        } else {
          originX--;
        }
      }
      return newCoord;
    }

  });

  if (!isRotationOutOfBounds(newBlockCoords) && !isRotationHittingFrozenBlock(newBlockCoords)) {
    return newBlockCoords;
  } else {
    return false;
  }
}

export default mapCoords;