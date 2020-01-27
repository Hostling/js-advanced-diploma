import { calcTileType } from '../utils';

test('top-left',() => {
  const received = calcTileType(0, 8);
  expect(received).toBe('top-left');
});

test('top-right',() => {
  const received = calcTileType(7, 8);
  expect(received).toBe('top-right');
});

test('bottom-left',() => {
  const received = calcTileType(56, 8);
  expect(received).toBe('bottom-left');
});

test('bottom-right',() => {
  const received = calcTileType(63, 8);
  expect(received).toBe('bottom-right');
});

test('top',() => {
  const received = calcTileType(3, 8);
  expect(received).toBe('top');
});

test('left',() => {
  const received = calcTileType(8, 8);
  expect(received).toBe('left');
});

test('right',() => {
  const received = calcTileType(15, 8);
  expect(received).toBe('right');
});

test('bottom',() => {
  const received = calcTileType(62, 8);
  expect(received).toBe('bottom');
});

test('center',() => {
  const received = calcTileType(10, 8);
  expect(received).toBe('center');
});
