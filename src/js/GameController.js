import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Undead from './Undead';
import Vampire from './Vampire';
import Daemon from './Daemon';
import { generateTeam } from './generators'
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.charactersCount = 3;
    this.maxLevel = 4;
    this.userTeam = [];
    this.enemyTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');

    const userPositions = Array.from(this.getStartPositions(this.gamePlay.boardSize, 'user'));
    const enemyPositions = Array.from(this.getStartPositions(this.gamePlay.boardSize, 'enemy'));
    this.userTeam = generateTeam([Bowman, Swordsman, Magician], this.maxLevel, this.charactersCount);
    this.enemyTeam = generateTeam([Undead, Vampire, Daemon], this.maxLevel, this.charactersCount);
    this.userTeam = this.userTeam.map((elem) => {
      return new PositionedCharacter(elem.value, userPositions.shift())
    });
    this.enemyTeam = this.enemyTeam.map((elem) => {
      return new PositionedCharacter(elem.value, enemyPositions.shift())
    });
    this.gamePlay.redrawPositions(this.userTeam.concat(this.enemyTeam));
  }

  getStartPositions(size, side) {
    const positions = [];
    const positionsSet = new Set();
    if(side === 'user') {
      positions.push(0);
      positions.push(1);
      for(let i = 0; i < size**2; i++) {
        if(i % size === 0) {
          positions.push(i);
          positions.push(i+1);
        }
      }
    } else {
      for(let i = 0; i < size**2; i++) {
        if((i + 1) % size === 0) {
          positions.push(i);
          positions.push(i-1);
        }
      }
    }

    while(positionsSet.size !== this.charactersCount) {
      positionsSet.add(positions[Math.floor(Math.random() * Math.floor(positions.length))])
    }

    return positionsSet;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
