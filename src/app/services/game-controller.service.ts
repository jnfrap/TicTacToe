import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService {

  // 0 = Player(X), 1 = Computer(O)
  private turn: BehaviorSubject<0|1> = new BehaviorSubject<0|1>(0);

  constructor() { }

  getTurn(): Observable<0|1> {
    return this.turn.asObservable();
  }

  setTurn(turn: 0|1): void {
    this.turn.next(turn);
  }

  switchTurn(): void {
    this.turn.next((this.turn.getValue() + 1) % 2 as 0|1);
  }
}