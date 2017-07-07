const blockDimensions = {
    square: {
      up: [
        {x:5, y: 1},
        {x:5, y: 2},
        {x:6, y: 1},
        {x:6, y: 2}
      ]
    },
    line: {
      up: [
        {x:5, y: 1},
        {x:5, y: 2},
        {x:5, y: 3},
        {x:5, y: 4}
      ],
      right: [
        {x:4, y: 1},
        {x:5, y: 1},
        {x:6, y: 1},
        {x:7, y: 1}
      ],
      down: [
        {x:5, y: 1},
        {x:5, y: 2},
        {x:5, y: 3},
        {x:5, y: 4}
      ],
      left: [
        {x:4, y: 1},
        {x:5, y: 1},
        {x:6, y: 1},
        {x:7, y: 1}
      ]
    },
    t: {
      up: [
        {x:5, y: 2},
        {x:6, y: 2},
        {x:7, y: 2},
        {x:6, y: 1}
      ],
      right: [
        {x:5, y: 1},
        {x:5, y: 2},
        {x:5, y: 3},
        {x:6, y: 2}
      ],
      down: [
        {x:5, y: 1},
        {x:6, y: 1},
        {x:7, y: 1},
        {x:6, y: 2}
      ],
      left: [
        {x:6, y: 1},
        {x:6, y: 2},
        {x:6, y: 3},
        {x:5, y: 2}
      ]
    }
}

export default blockDimensions;