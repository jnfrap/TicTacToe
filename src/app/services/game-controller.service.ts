import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService {

  // 0 = Player(X), 1 = Computer(O)
  private turn: BehaviorSubject<0|1> = new BehaviorSubject<0|1>(0);
  private gameStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gameEnded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gameResult!: string;
  private cellIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private cells: string[][] = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ]
  private computerCellSelection: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private reseting: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor() { }

  getTurn(): Observable<0|1> {
    return this.turn.asObservable();
  }

  setTurn(turn: 0|1): void {
    this.turn.next(turn);
  }

  getComputerCellSelection(): Observable<number> {
    return this.computerCellSelection.asObservable();
  }

  switchTurn(cellId: number): void {
    if (this.gameStarted.getValue() === false || this.gameEnded.getValue() === true) {
      return;
    }
    this.cellIds = this.cellIds.filter(id => id !== cellId);
    this.turn.next((this.turn.getValue() + 1) % 2 as 0|1);
    if (this.turn.getValue() === 1) {
      this.cells[Math.floor((cellId - 1) / 3)][(cellId - 1) % 3] = 'X';
      setTimeout(() => {
        this.computerPlay();
      }, 1000);
    }else{
      this.cells[Math.floor((cellId - 1) / 3)][(cellId - 1) % 3] = 'O';
    }

    const res: string = this.checkIfWon();
    if (res !== 'none') {
      this.endGame(res);
    }
  }

  computerPlay(): void {
    // Can computer win?
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.cells[i][j] === ' ') {
          this.cells[i][j] = 'O';
          if (this.checkIfWon() === 'cw') {
            this.computerCellSelection.next(i * 3 + j + 1);
            this.cellIds = this.cellIds.filter(id => id !== i * 3 + j + 1);
            return;
          }
          this.cells[i][j] = ' ';
        }
      }
    }

    // Can player win?
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.cells[i][j] === ' ') {
          this.cells[i][j] = 'X';
          if (this.checkIfWon() === 'pw') {
            this.computerCellSelection.next(i * 3 + j + 1);
            this.cellIds = this.cellIds.filter(id => id !== i * 3 + j + 1);
            this.cells[i][j] = 'O';
            return;
          }
          this.cells[i][j] = ' ';
        }
      }
    }
      

    // Can computer take the center?
    if (this.cells[1][1] === ' ') {
      this.computerCellSelection.next(5);
      this.cellIds = this.cellIds.filter(id => id !== 5);
      this.cells[1][1] = 'O';
      return;
    }
    // Random move
    const cellId = this.cellIds[Math.floor(Math.random() * this.cellIds.length)];
    this.computerCellSelection.next(cellId);
    this.cellIds = this.cellIds.filter(id => id !== cellId);
    this.cells[Math.floor((cellId - 1) / 3)][(cellId - 1) % 3] = 'O';
  }

  checkIfWon(): 'pw' | 'cw' | 'tie' | 'none' {
    for (let i = 0; i < 3; i++) {
      if (this.cells[i][0] === this.cells[i][1] && this.cells[i][1] === this.cells[i][2] && this.cells[i][0] !== ' ') {
        return this.cells[i][0] === 'X' ? 'pw' : 'cw';
      }
      if (this.cells[0][i] === this.cells[1][i] && this.cells[1][i] === this.cells[2][i] && this.cells[0][i] !== ' ') {
        return this.cells[0][i] === 'X' ? 'pw' : 'cw';
      }
    }
    if (this.cells[0][0] === this.cells[1][1] && this.cells[1][1] === this.cells[2][2] && this.cells[0][0] !== ' ') {
      return this.cells[0][0] === 'X' ? 'pw' : 'cw';
    }
    if (this.cells[0][2] === this.cells[1][1] && this.cells[1][1] === this.cells[2][0] && this.cells[0][2] !== ' ') {
      return this.cells[0][2] === 'X' ? 'pw' : 'cw';
    }
    if (this.cellIds.length === 0) {
      return 'tie';
    }
    return 'none';
  }

  getGameStarted(): Observable<boolean> {
    return this.gameStarted.asObservable();
  }

  getGameEnded(): Observable<boolean> {
    return this.gameEnded.asObservable();
  }

  startGame(): void {
    this.gameStarted.next(true);
  }

  endGame(gameResult: string): void {
    if (gameResult === 'pw') {
      this.gameResult = 'Player won';
    } else if (gameResult === 'cw') {
      this.gameResult = 'Computer won';
    }
    if (gameResult === 'tie') {
      this.gameResult = 'Tie';
    }
    this.gameEnded.next(true);
  }

  getGameResult(): string {
    return this.gameResult;
  }

  resetGame(): void {
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
    }

    this.turn.next(0);
    this.gameStarted.next(false);
    this.gameEnded.next(false);
    this.cellIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.cells = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ]
    this.computerCellSelection.next(-1);
    this.reseting.next(this.reseting.getValue() * -1);
  }

  getReseting(): Observable<number> {
    return this.reseting.asObservable();
  }
}