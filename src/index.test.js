const total = require("./index");

test("adds 2 numbers", () => {
  expect(total.sum(1, 2)).toBe(3);
});

test("ship characteristics", () => {
  const war = new total.ship(3, 0, "dest");
  war.hit();
  war.hit();
  war.hit();
  war.isSunk();
  expect(war).toEqual({
    length: 3,
    numberHits: 3,
    sunk: true,
    axis: 0,
    name: "dest",
  });
});

test("waters state", () => {
  const water = new total.Gameboard();
  let carrier = water.placeShip(8, 1, 5, 0, "carier");
  let battleship = water.placeShip(6, 5, 4, 0, "battleship");
  for (let i = 0; i < 5; i++) {
    water.recieveAttack(9, i);
  }
  water.recieveAttack(2, 3);
  let lol = water.recieveAttack(6, 6);

  //expect(water.ships.length).toBe(2);
  //expect(carrier).toBe(true);
  expect(lol).toBe(true);
});

test("player dynamic turns", () => {
  const friendlyWater = new total.Gameboard();
  const enemyWater = new total.Gameboard();
  const human = new total.Player(friendlyWater, enemyWater);
  const bot = new total.Player(enemyWater, friendlyWater, "ai");

  human.position(5, 0, "carrier", 8, 1);
  bot.position(3, 1, "submarine");

  expect(bot.attack()).toBe(true);
});
