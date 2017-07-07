import blockDimensions from './blockDimensions';
import { isRotationOutOfBounds, isRotationHittingFrozenBlock } from './rotate';

const  mapCoords = (currentBlockCoords, currentBlockName, orientation) => {
  const origin = currentBlockCoords[1];
  const newOrientationCoords = _.map(blockDimensions[currentBlockName][orientation], _.clone);
  let originX = origin.x;
  let originY = origin.y;

  const newBlockCoords = newOrientationCoords.map(function(coord) {
    if (currentBlockName === 'line') {
      if (orientation === 'right' || orientation === 'left') {
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

export default mapCoords;