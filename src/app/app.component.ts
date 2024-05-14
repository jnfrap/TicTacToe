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
  turnSubscription!: Subscription;

  constructor(
    private gameController: GameControllerService
  ) { }

  ngOnInit(): void {
    this.turnSubscription = this.gameController.getTurn().subscribe(turn => {
      this.turn = turn;
    });
  }
}
