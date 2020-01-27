import Daemon from '../Daemon';

test('Info', () => {
  const daemon = new Daemon(1);
  const expected = '🎖 1 ⚔ 10 🛡 40 ❤ 50';
  const received = daemon.showInfo();
  expect(received).toEqual(expected);
});
