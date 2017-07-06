var gridCoords = [];
var x = 1;
var y = 1;

for(var i  = 1; i < 200; i++) {
  if (x === 11) x = 1;
  gridCoords.push({ x: x, y: y });
  if (i % 10 === 0) y++;
  x++;
}