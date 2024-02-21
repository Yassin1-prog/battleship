function validMove(arr) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arr[i][j] == 0) {
        return [i, j];
      }
    }
  }
}

function validPlace(x, y, length, axis, valid) {
  if (axis == 0) {
    for (let i = y - 1; i < y + length + 1; i++) {
      for (let j = x - 1; j < x + 2; j++) {
        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {
          if (valid[j][i] != 0 && j == x && i >= y && i < y + length) {
            return false;
          }
        }
      }
    }
    for (let i = y - 1; i < y + length + 1; i++) {
      for (let j = x - 1; j < x + 2; j++) {
        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {
          valid[j][i] = 1;
        }
      }
    }
    return true;
  } else if (axis == 1) {
    for (let i = x - 1; i < x + length + 1; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {
          if (valid[i][j] != 0 && j == y && i >= x && i < x + length) {
            return false;
          }
        }
      }
    }
    for (let i = x - 1; i < x + length + 1; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {
          valid[i][j] = 1;
        }
      }
    }
    return true;
  }
}

module.exports = { validMove, validPlace };
