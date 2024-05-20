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

  /**
   * Returns the current turn as an observable
   * @returns 0 if it's player's turn, 1 if it's computer's turn
   */
  getTurn(): Observable<0|1> {
    return this.turn.asObservable();
  }

  /**
   * Sets the turn to the given value
   * @param turn 0 if it's player's turn, 1 if it's computer's turn
   */
  setTurn(turn: 0|1): void {
    this.turn.next(turn);
  }

  /**
   * Returns the cell selection of the computer as an observable
   * @returns the cell selection of the computer
   */
  getComputerCellSelection(): Observable<number> {
    return this.computerCellSelection.asObservable();
  }

  /**
   * Switches the turn and updates the cells array. If it's computer's turn, computer plays and returns the cell selection of the computer after 1 second of delay. If the game is ended, it does nothing.
   * @param cellId The id of the cell that is selected by the player or the computer
   */
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

  /**
   * Computer plays by checking if it can win in the next move, if the player can win in the next move, if it can take the center, or if it should make a random move.
   */
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

  /**
   * Checks if the game is ended by checking if there is a winner or if it's a tie
   * @returns 'pw' if the player won, 'cw' if the computer won, 'tie' if it's a tie, 'none' if the game is not ended yet
   */
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

  /**
   * Returns a boolean observable that indicates if the game is started
   * @returns true if the game is started, false otherwise
   */
  getGameStarted(): Observable<boolean> {
    return this.gameStarted.asObservable();
  }

  /**
   * Returns a boolean observable that indicates if the game is ended
   * @returns true if the game is ended, false otherwise
   */
  getGameEnded(): Observable<boolean> {
    return this.gameEnded.asObservable();
  }

  /**
   * Starts the game by setting the gameStarted to true
   */
  startGame(): void {
    this.gameStarted.next(true);
  }

  /**
   * Ends the game by setting the gameEnded to true and setting the gameResult to the given value
   * @param gameResult 'pw' if the player won, 'cw' if the computer won, 'tie' if it's a tie
   */
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

  /**
   * Returns the game result as string
   * @returns 'Player won' if the player won, 'Computer won' if the computer won, 'Tie' if it's a tie
   */
  getGameResult(): string {
    return this.gameResult;
  }

  /**
   * Resets the game by resetting all the variables to their initial values
   */
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

  /**
   * Gets a number observable that indicates if the game is currently reseting. It's value changes every time the game is reset. This is to notify the cells to reset their values and prevent the computer from playing after the game is reset.
   * @returns A number observable that indicates if the game is currently reseting
   */
  getReseting(): Observable<number> {
    return this.reseting.asObservable();
  }
}