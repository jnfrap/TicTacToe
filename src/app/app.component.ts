import { Component } from '@angular/core';
import { GameControllerService } from './services/game-controller.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  turn!: 0|1;
  gameStarted!: boolean;
  gameEnded!: boolean;

  turnSubscription!: Subscription;
  gameStartedSubscription!: Subscription;

  turnTextOptions: string[] = ['Your turn', 'Opponent turn'];
  turnText: string = this.turnTextOptions[this.turn];

  constructor(
    private gameController: GameControllerService
  ) { }

  ngOnInit(): void {
    // Subscribe to the turn observable to get the current turn
    this.turnSubscription = this.gameController.getTurn().subscribe(turn => {
      this.turn = turn;
      this.turnText = this.turnTextOptions[this.turn];
    });
    // Subscribe to the gameStarted observable to get the gameStarted value
    this.gameStartedSubscription = this.gameController.getGameStarted().subscribe(gameStarted => {
      this.gameStarted = gameStarted;
    });
    // Subscribe to the gameEnded observable to get the gameEnded value. If the game is ended, set the turnText to the game result
    this.gameController.getGameEnded().subscribe(gameEnded => {
      this.gameEnded = gameEnded;
      if (gameEnded) {
        this.turnText = this.gameController.getGameResult();
      }
    });
  }

  /**
   * Calls the resetGame method of the gameController to reset the game
   */
  resetGame() {
    this.gameController.resetGame();
  }
}
