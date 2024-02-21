const helper = require("./helper");

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
    this.validPosition = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      this.validPosition[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push(0);
        this.validPosition[i].push(0);
      }
    }
  }

  placeShip(x, y, length, axis, name) {
    const boat = new ship(length, axis, name);
    this.ships.push(boat);
    if (
      axis == 0 &&
      y + length - 1 < 10 &&
      helper.validPlace(x, y, length, 0, this.validPosition)
    ) {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = name;
      }
      return true;
    } else if (
      axis == 1 &&
      x + length - 1 < 10 &&
      helper.validPlace(x, y, length, 1, this.validPosition)
    ) {
      for (let i = 0; i < length; i++) {
        this.board[x + i][y] = name;
      }
      return true;
    } else {
      this.ships.pop();
      return false;
    }
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
      boatDamaged.isSunk();
      this.board[x][y] = 2;
      return true;
    } else {
      return false;
    }
  }

  isLost() {
    const destroyedShips = this.ships.filter((ship) => ship.isSunk() == true);
    if (destroyedShips.length === this.ships.length) {
      return true;
    } else {
      return false;
    }
  }
}

class Player {
  constructor(friend, enemy, type = "human") {
    this.turn = false;
    this.type = type;
    this.enemy = enemy;
    this.friend = friend;
  }

  position(length, axis, name, x = 0, y = 0) {
    if (this.type == "ai") {
      let i = Math.floor(Math.random() * 10);
      let j = Math.floor(Math.random() * 10);
      while (!this.friend.placeShip(i, j, length, axis, name)) {
        i = Math.floor(Math.random() * 10);
        j = Math.floor(Math.random() * 10);
      }
    } else {
      return this.friend.placeShip(x, y, length, axis, name);
    }
  }

  attack(row = null, column = null) {
    if (this.type == "ai") {
      let cnt = 0;
      while (true) {
        cnt++;
        if (cnt == 15) {
          let arr = helper.validMove(this.enemy.board);
          return this.enemy.recieveAttack(arr[0], arr[1]);
        }
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (this.enemy.recieveAttack(x, y)) {
          return true;
        }
      }
    } else {
      return this.enemy.recieveAttack(row, column);
    }
  }
}

class screenController {
  constructor() {
    this.friendlyWater = new Gameboard();
    this.enemyWater = new Gameboard();
    this.human = new Player(this.friendlyWater, this.enemyWater);
    this.bot = new Player(this.enemyWater, this.friendlyWater, "ai");

    this.stage = "position";
    this.counter = 5;

    this.fleet1 = document.querySelector(".friendlyWater");
    this.fleet2 = document.querySelector(".enemyWater");

    this.fleet1.addEventListener("click", this.clickHandlerBoard.bind(this));
    this.fleet2.addEventListener("click", this.clickHandlerBoard.bind(this));

    this.updateScreen();
  }

  updateScreen() {
    this.fleet1.textContent = "";
    this.fleet2.textContent = "";

    this.friendlyWater.board.forEach((row, indexRow) => {
      row.forEach((cell, indexCol) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        if (this.friendlyWater.board[indexRow][indexCol] == 1) {
          cellButton.style.backgroundColor = "blue";
        } else if (this.friendlyWater.board[indexRow][indexCol] == 2) {
          cellButton.style.backgroundColor = "red";
        } else if (this.friendlyWater.board[indexRow][indexCol] == "c") {
          cellButton.style.backgroundColor = "gray";
        }

        cellButton.dataset.column = indexCol;
        cellButton.dataset.row = indexRow;
        this.fleet1.appendChild(cellButton);
      });
    });

    this.enemyWater.board.forEach((row, indexRow) => {
      row.forEach((cell, indexCol) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        if (this.enemyWater.board[indexRow][indexCol] == 1) {
          cellButton.style.backgroundColor = "blue";
        } else if (this.enemyWater.board[indexRow][indexCol] == 2) {
          cellButton.style.backgroundColor = "red";
        } else if (this.enemyWater.board[indexRow][indexCol] == "s") {
          cellButton.style.backgroundColor = "gray";
        }

        cellButton.dataset.column = indexCol;
        cellButton.dataset.row = indexRow;
        this.fleet2.appendChild(cellButton);
      });
    });
  }

  clickHandlerBoard(e) {
    const selectedRow = parseInt(e.target.dataset.row);
    const selectedCol = parseInt(e.target.dataset.column);
    console.log(selectedRow);
    console.log(selectedCol);

    if (selectedCol == undefined || !selectedRow == undefined) return;

    if (this.stage == "position") {
      if (!this.human.position(this.counter, 1, "c", selectedRow, selectedCol))
        return;

      this.bot.position(this.counter, 0, "s");
      this.counter--;
      if (this.counter === 0) {
        this.stage = "play";
      }
    } else {
      console.log(this.friendlyWater.validPosition);
      console.log(this.enemyWater.validPosition);
      if (selectedCol == undefined || !selectedRow == undefined) return;
      if (!this.human.attack(selectedRow, selectedCol)) return;
      this.bot.attack();
    }

    this.updateScreen();
  }
}

const game = new screenController();

//Tests
/*
const water = new Gameboard();
let carrier = water.placeShip(9, 0, 5, 0, "carier");
let battleship = water.placeShip(6, 5, 4, 0, "battleship");
for (let i = 0; i < 5; i++) {
  water.recieveAttack(9, i);
}
water.recieveAttack(2, 3);
water.recieveAttack(6, 6);

console.log(carrier);
console.log(battleship);
console.log(water.ships.length);
console.log(water.validPosition);

const friendlyWater = new Gameboard();
const enemyWater = new Gameboard();
const human = new Player(friendlyWater, enemyWater);
const bot = new Player(enemyWater, friendlyWater, "ai");

human.position(5, 0, "c", 0, 0);
bot.position(5, 1, "s");
human.position(4, 0, "c", 2, 0);
bot.position(4, 1, "s");
console.log(human.position(3, 0, "c", 4, 0));
bot.position(3, 1, "s");
human.position(2, 0, "c", 6, 0);
bot.position(2, 1, "s");
human.position(1, 0, "c", 8, 0);
bot.position(1, 1, "s");
console.log(friendlyWater.board);
console.log(enemyWater.board);

console.log(bot.attack());
*/
module.exports = { sum, ship, Gameboard, Player };
