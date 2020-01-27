import Character from '../Character';
import Daemon from '../Daemon';

test('Daemon', () => {
  const received = new Daemon(1);
  const expected = {
    level: 1,
    health: 50,
    type: 'daemon',
    attack: 10,
    defence: 40,
    walkRange: 1,
    attackRange: 4,
  };
  expect(received).toEqual(expected);
});

test('Character', () => {
  expect(() => {
    new Character();
  }).toThrow();
});
