/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/***/ ((module) => {

eval("function validMove(arr) {\n  for (let i = 0; i < 10; i++) {\n    for (let j = 0; j < 10; j++) {\n      if (arr[i][j] == 0) {\n        return [i, j];\n      }\n    }\n  }\n}\n\nfunction validPlace(x, y, length, axis, valid) {\n  if (axis == 0) {\n    for (let i = y - 1; i < y + length + 1; i++) {\n      for (let j = x - 1; j < x + 2; j++) {\n        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {\n          if (valid[j][i] != 0 && j == x && i >= y && i < y + length) {\n            return false;\n          }\n        }\n      }\n    }\n    for (let i = y - 1; i < y + length + 1; i++) {\n      for (let j = x - 1; j < x + 2; j++) {\n        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {\n          valid[j][i] = 1;\n        }\n      }\n    }\n    return true;\n  } else if (axis == 1) {\n    for (let i = x - 1; i < x + length + 1; i++) {\n      for (let j = y - 1; j < y + 2; j++) {\n        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {\n          if (valid[i][j] != 0 && j == y && i >= x && i < x + length) {\n            return false;\n          }\n        }\n      }\n    }\n    for (let i = x - 1; i < x + length + 1; i++) {\n      for (let j = y - 1; j < y + 2; j++) {\n        if (!(i < 0 || j < 0 || i > 9 || j > 9)) {\n          valid[i][j] = 1;\n        }\n      }\n    }\n    return true;\n  }\n}\n\nmodule.exports = { validMove, validPlace };\n\n\n//# sourceURL=webpack://html_css_js_template/./src/helper.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\n\nfunction sum(a, b) {\n  return a + b;\n}\n\nclass ship {\n  constructor(length, axis = 0, name = \"ship\") {\n    this.length = length;\n    this.numberHits = 0;\n    this.sunk = false;\n    this.axis = axis;\n    this.name = name;\n  }\n\n  hit() {\n    this.numberHits++;\n  }\n\n  isSunk() {\n    if (this.length === this.numberHits) {\n      this.sunk = true;\n    }\n  }\n}\n\nclass Gameboard {\n  constructor() {\n    this.ships = [];\n    this.board = [];\n    this.validPosition = [];\n    for (let i = 0; i < 10; i++) {\n      this.board[i] = [];\n      this.validPosition[i] = [];\n      for (let j = 0; j < 10; j++) {\n        this.board[i].push(0);\n        this.validPosition[i].push(0);\n      }\n    }\n  }\n\n  placeShip(x, y, length, axis, name) {\n    const boat = new ship(length, axis, name);\n    this.ships.push(boat);\n    if (\n      axis == 0 &&\n      y + length - 1 < 10 &&\n      helper.validPlace(x, y, length, 0, this.validPosition)\n    ) {\n      for (let i = 0; i < length; i++) {\n        this.board[x][y + i] = name;\n      }\n      return true;\n    } else if (\n      axis == 1 &&\n      x + length - 1 < 10 &&\n      helper.validPlace(x, y, length, 1, this.validPosition)\n    ) {\n      for (let i = 0; i < length; i++) {\n        this.board[x + i][y] = name;\n      }\n      return true;\n    } else {\n      this.ships.pop();\n      return false;\n    }\n  }\n\n  recieveAttack(x, y) {\n    if (this.board[x][y] === 0) {\n      this.board[x][y] = 1;\n      return true;\n    } else if (\n      this.board[x][y] != 0 &&\n      this.board[x][y] != 1 &&\n      this.board[x][y] != 2\n    ) {\n      const boatDamaged = this.ships.find(\n        (boat) => boat.name === this.board[x][y]\n      );\n      boatDamaged.hit();\n      boatDamaged.isSunk();\n      this.board[x][y] = 2;\n      return true;\n    } else {\n      return false;\n    }\n  }\n\n  isLost() {\n    const destroyedShips = this.ships.filter((ship) => ship.isSunk() == true);\n    if (destroyedShips.length === this.ships.length) {\n      return true;\n    } else {\n      return false;\n    }\n  }\n}\n\nclass Player {\n  constructor(friend, enemy, type = \"human\") {\n    this.turn = false;\n    this.type = type;\n    this.enemy = enemy;\n    this.friend = friend;\n  }\n\n  position(length, axis, name, x = 0, y = 0) {\n    if (this.type == \"ai\") {\n      let i = Math.floor(Math.random() * 10);\n      let j = Math.floor(Math.random() * 10);\n      while (!this.friend.placeShip(i, j, length, axis, name)) {\n        i = Math.floor(Math.random() * 10);\n        j = Math.floor(Math.random() * 10);\n      }\n    } else {\n      return this.friend.placeShip(x, y, length, axis, name);\n    }\n  }\n\n  attack(row = null, column = null) {\n    if (this.type == \"ai\") {\n      let cnt = 0;\n      while (true) {\n        cnt++;\n        if (cnt == 15) {\n          let arr = helper.validMove(this.enemy.board);\n          return this.enemy.recieveAttack(arr[0], arr[1]);\n        }\n        let x = Math.floor(Math.random() * 10);\n        let y = Math.floor(Math.random() * 10);\n        if (this.enemy.recieveAttack(x, y)) {\n          return true;\n        }\n      }\n    } else {\n      return this.enemy.recieveAttack(row, column);\n    }\n  }\n}\n\nclass screenController {\n  constructor() {\n    this.friendlyWater = new Gameboard();\n    this.enemyWater = new Gameboard();\n    this.human = new Player(this.friendlyWater, this.enemyWater);\n    this.bot = new Player(this.enemyWater, this.friendlyWater, \"ai\");\n\n    this.stage = \"position\";\n    this.counter = 5;\n\n    this.fleet1 = document.querySelector(\".friendlyWater\");\n    this.fleet2 = document.querySelector(\".enemyWater\");\n\n    this.fleet1.addEventListener(\"click\", this.clickHandlerBoard.bind(this));\n    this.fleet2.addEventListener(\"click\", this.clickHandlerBoard.bind(this));\n\n    this.updateScreen();\n  }\n\n  updateScreen() {\n    this.fleet1.textContent = \"\";\n    this.fleet2.textContent = \"\";\n\n    this.friendlyWater.board.forEach((row, indexRow) => {\n      row.forEach((cell, indexCol) => {\n        const cellButton = document.createElement(\"button\");\n        cellButton.classList.add(\"cell\");\n\n        if (this.friendlyWater.board[indexRow][indexCol] == 1) {\n          cellButton.style.backgroundColor = \"blue\";\n        } else if (this.friendlyWater.board[indexRow][indexCol] == 2) {\n          cellButton.style.backgroundColor = \"red\";\n        } else if (this.friendlyWater.board[indexRow][indexCol] == \"c\") {\n          cellButton.style.backgroundColor = \"gray\";\n        }\n\n        cellButton.dataset.column = indexCol;\n        cellButton.dataset.row = indexRow;\n        this.fleet1.appendChild(cellButton);\n      });\n    });\n\n    this.enemyWater.board.forEach((row, indexRow) => {\n      row.forEach((cell, indexCol) => {\n        const cellButton = document.createElement(\"button\");\n        cellButton.classList.add(\"cell\");\n\n        if (this.enemyWater.board[indexRow][indexCol] == 1) {\n          cellButton.style.backgroundColor = \"blue\";\n        } else if (this.enemyWater.board[indexRow][indexCol] == 2) {\n          cellButton.style.backgroundColor = \"red\";\n        } else if (this.enemyWater.board[indexRow][indexCol] == \"s\") {\n          cellButton.style.backgroundColor = \"gray\";\n        }\n\n        cellButton.dataset.column = indexCol;\n        cellButton.dataset.row = indexRow;\n        this.fleet2.appendChild(cellButton);\n      });\n    });\n  }\n\n  clickHandlerBoard(e) {\n    const selectedRow = parseInt(e.target.dataset.row);\n    const selectedCol = parseInt(e.target.dataset.column);\n    console.log(selectedRow);\n    console.log(selectedCol);\n\n    if (selectedCol == undefined || !selectedRow == undefined) return;\n\n    if (this.stage == \"position\") {\n      if (!this.human.position(this.counter, 1, \"c\", selectedRow, selectedCol))\n        return;\n\n      this.bot.position(this.counter, 0, \"s\");\n      this.counter--;\n      if (this.counter === 0) {\n        this.stage = \"play\";\n      }\n    } else {\n      console.log(this.friendlyWater.validPosition);\n      console.log(this.enemyWater.validPosition);\n      if (selectedCol == undefined || !selectedRow == undefined) return;\n      if (!this.human.attack(selectedRow, selectedCol)) return;\n      this.bot.attack();\n    }\n\n    this.updateScreen();\n  }\n}\n\nconst game = new screenController();\n\n//Tests\n/*\nconst water = new Gameboard();\nlet carrier = water.placeShip(9, 0, 5, 0, \"carier\");\nlet battleship = water.placeShip(6, 5, 4, 0, \"battleship\");\nfor (let i = 0; i < 5; i++) {\n  water.recieveAttack(9, i);\n}\nwater.recieveAttack(2, 3);\nwater.recieveAttack(6, 6);\n\nconsole.log(carrier);\nconsole.log(battleship);\nconsole.log(water.ships.length);\nconsole.log(water.validPosition);\n\nconst friendlyWater = new Gameboard();\nconst enemyWater = new Gameboard();\nconst human = new Player(friendlyWater, enemyWater);\nconst bot = new Player(enemyWater, friendlyWater, \"ai\");\n\nhuman.position(5, 0, \"c\", 0, 0);\nbot.position(5, 1, \"s\");\nhuman.position(4, 0, \"c\", 2, 0);\nbot.position(4, 1, \"s\");\nconsole.log(human.position(3, 0, \"c\", 4, 0));\nbot.position(3, 1, \"s\");\nhuman.position(2, 0, \"c\", 6, 0);\nbot.position(2, 1, \"s\");\nhuman.position(1, 0, \"c\", 8, 0);\nbot.position(1, 1, \"s\");\nconsole.log(friendlyWater.board);\nconsole.log(enemyWater.board);\n\nconsole.log(bot.attack());\n*/\nmodule.exports = { sum, ship, Gameboard, Player };\n\n\n//# sourceURL=webpack://html_css_js_template/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;