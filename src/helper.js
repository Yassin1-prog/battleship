function validMove(arr) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arr[i][j] == 0 || typeof arr[i][j] == "string") {
        return [i, j];
      }
    }
  }
}

function smartMove(arr, visited) {
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      if (arr[i][j] == 2 && visited[i][j] == 0) {
        if (typeof arr[i - 1][j] == "string") {
          return [i - 1, j];
        } else if (typeof arr[i][j - 1] == "string") {
          return [i, j - 1];
        } else if (typeof arr[i][j + 1] == "string") {
          return [i, j + 1];
        } else if (typeof arr[i + 1][j] == "string") {
          return [i + 1, j];
        } else {
          visited[i][j] = 1;
        }
      }
    }
  }
}

function averageMove(arr, visited) {
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      if (arr[i][j] == 2 && visited[i][j] == 0) {
        if (arr[i - 1][j] != 1 && arr[i - 1][j] != 2) {
          return [i - 1, j];
        } else if (arr[i][j - 1] != 1 && arr[i][j - 1] != 2) {
          return [i, j - 1];
        } else if (arr[i][j + 1] != 1 && arr[i][j + 1] != 2) {
          return [i, j + 1];
        } else if (arr[i + 1][j] != 1 && arr[i + 1][j] != 2) {
          return [i + 1, j];
        } else {
          visited[i][j] = 1;
        }
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

function randomPosition(friend, length, name) {
  let axis = Math.floor(Math.random() * 2);
  let i = Math.floor(Math.random() * 10);
  let j = Math.floor(Math.random() * 10);
  while (!friend.placeShip(i, j, length, axis, name)) {
    i = Math.floor(Math.random() * 10);
    j = Math.floor(Math.random() * 10);
  }
}

module.exports = {
  validMove,
  validPlace,
  randomPosition,
  smartMove,
  averageMove,
};
