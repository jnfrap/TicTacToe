import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameControllerService } from 'src/app/services/game-controller.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {

  @Input() id!: number;
  cellPosibleValues: string[] = [' ', 'X', 'O'];
  cellValue: string = ' ';
  clickable: boolean = true;
  turnSubscription!: Subscription;
  turn!: 0|1;
  pressed: boolean = false;
  gameStarted: boolean = false;
  gameEnded: boolean = false;

  constructor(
    private gameController: GameControllerService
  ) { }

  ngOnInit(): void {
    // Subscribe to the turn observable to get the current turn
    this.turnSubscription = this.gameController.getTurn().subscribe(turn => {
      this.turn = turn;
      if (this.turn === 0) {
        this.clickable = true;
      }
    });

    // Subscribe to the computerCellSelection observable to get the cell selection of the computer and mark the cell with 'O' if this cell is selected by the computer
    this.gameController.getComputerCellSelection().subscribe(cellId => {
      if (cellId === this.id && this.turn === 1 && this.clickable && !this.pressed && !this.gameEnded) {
        const htmltextcell = document.getElementById('Cell' + this.id);
        if (htmltextcell) {
          htmltextcell.style.color = 'rgba(255, 0, 0, 0.5)';
        }
        this.cellValue = 'O';
        this.clickable = false;
        this.pressed = true;
        this.gameController.switchTurn(this.id);
      }
    });

    // Subscribe to the gameStarted observable to get the gameStarted value
    this.gameController.getGameStarted().subscribe(gameStarted => {
      this.gameStarted = gameStarted;
    });

    // Subscribe to the gameEnded observable to get the gameEnded value
    this.gameController.getGameEnded().subscribe(gameEnded => {
      this.gameEnded = gameEnded;
    });

    // Subscribe to the reseting observable, reset the cell value and make it clickable when the game is reset
    this.gameController.getReseting().subscribe(reseting => {
        this.cellValue = ' ';
        this.clickable = true;
        this.pressed = false;
    });
  }

  onClickEventHandler() {
    // If is possible to click the cell, the game is started and it's player's turn, mark the cell with 'X' and switch the turn
    if (this.clickable && this.gameController.getGameStarted() && this.turn === 0 && !this.pressed) {
      if (!this.gameStarted) {
        this.gameController.startGame();
      }
      if (!this.gameEnded) {
        const htmltextcell = document.getElementById('Cell' + this.id);
        if (htmltextcell) {
          htmltextcell.style.color = 'rgba(0, 0, 255, 0.5)';
        }
        this.cellValue = 'X';
        this.clickable = false;
        this.pressed = true;
        this.gameController.switchTurn(this.id);
      }
    }
  }

}
