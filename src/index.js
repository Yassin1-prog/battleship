console.log("hello world");

function sum(a, b) {
  return a + b;
}

class ship {
  constructor(length, axis = 0, name = "ship") {
    this.length = length;
    this.numberHits = 0;
    this.sunk = false;
    this.axis = axis;
    this.name = name;
  }

  hit() {
    this.numberHits++;
  }

  isSunk() {
    if (this.length === this.numberHits) {
      this.sunk = true;
    }
  }
}

class Gameboard {
  constructor() {
    this.ships = [];
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push(0);
      }
    }
  }

  placeShip(x, y, length, axis, name) {
    const boat = new ship(length, axis, name);
    this.ships.push(boat);
    if (axis == 0 && y + length < 10) {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = name;
      }
      return true;
    } else if (axis == 1 && x + length < 10) {
      for (let i = 0; i < length; i++) {
        this.board[x + i][y] = name;
      }
      return true;
    }
    boat = undefined;
    this.ships.pop();
    return false;
  }

  recieveAttack(x, y) {
    if (this.board[x][y] === 0) {
      this.board[x][y] = 1;
      return true;
    } else if (
      this.board[x][y] != 0 &&
      this.board[x][y] != 1 &&
      this.board[x][y] != 2
    ) {
      const boatDamaged = this.ships.find(
        (boat) => boat.name === this.board[x][y]
      );
      boatDamaged.hit();
      boatDamaged.sunk();
      this.board[x][y] = 2;
      return true;
    } else {
      return false;
    }
  }

  isLost() {
    const destroyedShips = this.ships.filter((ship) => ship.sunk() == true);
    if (destroyedShips.length === this.ships.length) {
      return true;
    } else {
      return false;
    }
  }
}

class Player {
  constructor(type = "human", enemy) {
    this.turn = false;
    this.type = type;
    this.enemy = enemy;
  }

  play() {
    if (this.type == "ai") {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let flag = true;
      while (flag) {
        if (this.enemy.recieveAttack(x, y)) {
          flag = false;
        }
      }
    }
  }
}

module.exports = { sum, ship };
