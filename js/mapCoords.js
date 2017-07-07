import { isRotationOutOfBounds, isRotationHittingFrozenBlock } from './rotate';

const  mapCoords = (currentBlockCoords, currentBlockName, orientation) => {
  const origin = currentBlockCoords[1];
  let originX = origin.x;
  let originY = origin.y;

  const newBlockCoords = currentBlockCoords.map((coord, index) => {

    if (currentBlockName === 'line') {
      let newCoord;
      if (orientation === 'right' || orientation === 'left') {
        newCoord = {
          x: originX,
          y: origin.y
        };
        originX++;
      } else {
        newCoord = {
            x: origin.x,
            y: originY
          };
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
        if (index === 2) {
          originX--;
        } else {
          originX++;
        }
      } else if (orientation === 'left') {
        if (index === 2) {
          originX--;
          originY++;
        } else {
          originY--;
        }
      } else if (orientation === 'up') {
        if (index === 2) {
          originX++;
          originY--;
        } else {
          originX--;
        }
      }
      return newCoord;
    }

    if (currentBlockName === 's') {
      let newCoord = {
          x: originX,
          y: originY
        };
      if (orientation === 'right') {
        if (index % 2 !== 0) {
          originX++;
        } else {
          originY++;
        }
      } else if (orientation === 'down') {
        if (index % 2 !== 0) {
          originY++;
        } else {
          originX--;
          originY--;
        }
      } else if (orientation === 'left') {
        if (index % 2 !== 0) {
          originX--;
        } else {
          originY++;
        }
      } else if (orientation === 'up') {
        if (index % 2 !== 0) {
          originY++;
        } else {
          originY--;
          originX++;
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