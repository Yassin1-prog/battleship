const total = require("./index");

test("adds 2 numbers", () => {
  expect(total.sum(1, 2)).toBe(3);
});

test("ship characteristics", () => {
  const war = new total.ship(3);
  war.hit();
  war.hit();
  war.hit();
  war.isSunk();
  expect(war).toEqual({ length: 3, numberHits: 3, sunk: true, axis: 0 });
});
