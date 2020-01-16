import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Undead from './Undead';
import Vampire from './Vampire';
import Daemon from './Daemon';
import { generateTeam } from './generators'
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.charactersCount = 3;
    this.maxLevel = 4;
    this.userTeam = [];
    this.enemyTeam = [];
    this.selectedCell = undefined;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    // Отрисовываем поле
    this.gamePlay.drawUi('prairie');

    // Отрисовываем персонажей на поле
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

    // Подписываемся на события на поле
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
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
    // Получаем массив со списком ячеек с парсонажами игрока
    const userCharactersPositions = this.userTeam.map((elem) => {
      return elem.position;
    });
    if(this.selectedCell === undefined) {
      if (userCharactersPositions.indexOf(index) === -1) {
        GamePlay.showError('В этой ячейке нет персонажа вашей команды!');
        return null;
      }
      if (this.selectedCell !== undefined) {
        this.gamePlay.deselectCell(this.selectedCell);
        this.selectedCell = undefined;
      }
      this.gamePlay.selectCell(index);
      this.selectedCell = index;
    } else {
      const selectedCharacter = this.userTeam.find((element) => element.position === this.selectedCell);
      const allow = this.isAllowed(selectedCharacter, index);
      if(userCharactersPositions.indexOf(index) !== -1) {
        this.gamePlay.setCursor('pointer');
      } else if(!allow) {
        this.gamePlay.setCursor('not-allowed');
      } else if(allow.attack) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      } else if (allow.walk) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      }
    }
  }

  onCellEnter(index) {
    // Проверяем есть ли персонаж в выбранной клетке
    const allCharacters = this.userTeam.concat(this.enemyTeam);
    const allCharactersPositions = allCharacters.map((elem) => {
      return elem.position;
    });
    if(allCharactersPositions.indexOf(index) !== -1) {
      allCharacters.forEach((element) => {
        if (element.position === index) this.gamePlay.showCellTooltip(element.character.showInfo(), index);
      });
    }
  }

  isAllowed(positionedCharacter, index) {
    // Ищем соседние клетки, учитывая, что поле квадратное
    const range = positionedCharacter.character.getRange();
    const position = this.convertIndex(positionedCharacter.position);
    const allCharacters = this.userTeam.concat(this.enemyTeam);
    const target = this.convertIndex(index);
    // let top, topRight, right, rightBottom, bottom, bottomLeft, left, leftTop = [];
    console.log(range);

    function isCellEmpty(index) {
      const cellsWithCharacters = allCharacters.map((elem) => elem.position);
      return cellsWithCharacters.indexOf(index) === -1 ? true : false;
    }
    if(isCellEmpty(index)) {
      // Клетка пустая. Проверяем, можно ли на нее пойти
      // Считаем диагонали, чтобы исключить соседние дальние клетки
      const diagonals = [];
      const size = this.gamePlay.boardSize;
      for(let i = 1; i <= range.walk; i++) {
        let row = position[0];
        let column = position[1]
        if(row - i >= 0 && column + i < size) diagonals.push(this.convertIndex([row - i, column + i]));
        if(row + i < size && column + i < size) diagonals.push(this.convertIndex([row + i, column + i]));
        if(row + i < size && column - i >= 0) diagonals.push(this.convertIndex([row + i, column - i]));
        if(row - i >= 0 && column - i >= 0) diagonals.push(this.convertIndex([row - i, column - i]));
      }
      console.log(diagonals, index);
      if((position[0] === target[0] && Math.abs(position[1] - target[1]) <= range.walk) // Горизонталь
      || (position[1] === target[1] && Math.abs(position[0] - target[0]) <= range.walk) // Вертикаль
      || diagonals.includes(index)) { // Диагональ
        return { walk: true, attack: false };
      }
    } else if(this.enemyTeam.map((elem) => elem.position).indexOf(index) !== -1) {
      // На клетке враг
      if((position[0] === target[0] && Math.abs(position[1] - target[1]) <= range.attack) // Горизонталь
      || (position[1] === target[1] && Math.abs(position[0] - target[0]) <= range.attack) // Вертикаль
      || (Math.abs(position[1] - target[1]) <= range.attack && Math.abs(position[0] - target[0]) <= range.attack)) { // Диагональ
        return { walk: false, attack: true };
      }
    } else {
      return false;
    }

  }

  convertIndex(index) {
    if(Array.isArray(index)){
      const row = index[0];
      const column = index[1];
      return row * this.gamePlay.boardSize + column;
    } else {
      const row = Math.floor(index/this.gamePlay.boardSize);
      const column = index % this.gamePlay.boardSize;
      return [row, column];
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
