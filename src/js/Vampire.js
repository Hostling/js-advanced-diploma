import Character from './Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 40;
    this.defence = 10;
    this.walkRange = 2;
    this.attackRange = 2;
  }
}
