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
    this.smartAI = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      this.validPosition[i] = [];
      this.smartAI[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push(0);
        this.validPosition[i].push(0);
        this.smartAI[i].push(0);
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
    const destroyedShips = this.ships.filter((ship) => ship.sunk == true);
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

  position(length, name, axis = 1, x = 0, y = 0) {
    if (this.type == "ai") {
      helper.randomPosition(this.friend, length, name);
    } else {
      return this.friend.placeShip(x, y, length, axis, name);
    }
  }

  attack(row = null, column = null, dific = 0) {
    if (this.type == "ai") {
      let cnt = 0;
      while (true) {
        cnt++;
        if (cnt == 15) {
          let arr = helper.validMove(this.enemy.board);
          return this.enemy.recieveAttack(arr[0], arr[1]);
        }

        let checkmate;
        if (dific == 0) {
          checkmate = helper.averageMove(this.enemy.board, this.enemy.smartAI);
        } else {
          checkmate = helper.smartMove(this.enemy.board, this.enemy.smartAI);
        }
        if (Array.isArray(checkmate)) {
          return this.enemy.recieveAttack(checkmate[0], checkmate[1]);
        } else {
          let x = Math.floor(Math.random() * 10);
          let y = Math.floor(Math.random() * 10);
          if (this.enemy.recieveAttack(x, y)) {
            return true;
          }
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

    this.diff = 0;
    this.axis = 0;
    this.stage = "position";
    this.counter = 0;
    this.boats = [
      "CARRIER",
      "BATTLESHIP",
      "DESTROYER",
      "SUBMARINE",
      "PATROL BOAT",
    ];
    this.size = [5, 4, 3, 3, 2];

    this.fleet1 = document.querySelector(".friendlyWater");
    this.fleet2 = document.querySelector(".enemyWater");

    this.clickHandlerBoardBound = this.clickHandlerBoard.bind(this);
    this.fleet1.addEventListener("click", this.clickHandlerBoardBound);
    this.fleet2.addEventListener("click", this.clickHandlerBoardBound);

    const btn = document.querySelector(".btn");
    const btnn = document.querySelector(".btnn");
    const rotate = document.querySelector("#rotate");
    const dimension = document.querySelector(".rotate");

    rotate.addEventListener("click", (e) => {
      e.preventDefault();
      this.axis = this.axis === 0 ? 1 : 0;
      if (this.axis == 0) {
        dimension.textContent = "Horizontal";
      } else {
        dimension.textContent = "Vertical";
      }
    });

    btn.addEventListener("click", () => {
      window.location.reload();
    });

    btnn.addEventListener("click", () => {
      this.friendlyWater = new Gameboard();
      this.enemyWater = new Gameboard();
      this.human = new Player(this.friendlyWater, this.enemyWater);
      this.bot = new Player(this.enemyWater, this.friendlyWater, "ai");

      for (let i = 0; i < 5; i++) {
        helper.randomPosition(this.friendlyWater, this.size[i], this.boats[i]);
        this.bot.position(this.size[i], this.boats[i]);
      }
      this.stage = "play";
      this.updateScreen();
    });

    const how = document.querySelector(".how");
    const close = document.querySelector(".close");
    const modal = document.querySelector(".modal");

    how.addEventListener("click", (e) => {
      e.preventDefault();
      modal.showModal();
    });

    close.addEventListener("click", () => {
      modal.close();
    });

    this.updateScreen();
  }

  updateScreen() {
    this.fleet1.textContent = "";
    this.fleet2.textContent = "";

    const display = document.querySelector(".display");
    if (this.stage == "position") {
      display.textContent = "Position your fleet";
    } else {
      display.textContent = "War ongoing...";
    }

    if (this.stage == "play") {
      this.fleet1.removeEventListener("click", this.clickHandlerBoardBound);
    }

    if (this.stage == "play" && this.friendlyWater.isLost()) {
      this.fleet2.removeEventListener("click", this.clickHandlerBoardBound);
      display.textContent = "War over, your fleet got destroyed, LOSER";
    } else if (this.stage == "play" && this.enemyWater.isLost()) {
      this.fleet2.removeEventListener("click", this.clickHandlerBoardBound);
      display.textContent = "War over, you destroyed the enemy fleet, WINNER";
    }

    this.friendlyWater.board.forEach((row, indexRow) => {
      row.forEach((cell, indexCol) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        if (this.friendlyWater.board[indexRow][indexCol] == 1) {
          cellButton.style.backgroundColor = "blue";
        } else if (this.friendlyWater.board[indexRow][indexCol] == 2) {
          cellButton.style.backgroundColor = "red";
        } else if (
          typeof this.friendlyWater.board[indexRow][indexCol] == "string"
        ) {
          cellButton.style.backgroundColor = "gray";
        } else {
          cellButton.classList.add("cell1");
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
        } else {
          cellButton.classList.add("cell1");
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

    if (isNaN(selectedCol) || isNaN(selectedRow)) return;

    if (this.stage == "position") {
      if (
        !this.human.position(
          this.size[this.counter],
          this.boats[this.counter],
          this.axis,
          selectedRow,
          selectedCol
        )
      )
        return;

      this.bot.position(this.size[this.counter], this.boats[this.counter]);
      this.counter++;
      if (this.counter === 5) {
        this.stage = "play";
      }
    } else {
      if (isNaN(selectedCol) || isNaN(selectedRow)) return;
      if (!this.human.attack(selectedRow, selectedCol)) return;

      const cb = document.querySelector("#diff");
      if (cb.checked) {
        this.diff = 1;
      } else {
        this.diff = 0;
      }
      this.bot.attack(0, 0, this.diff);
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
