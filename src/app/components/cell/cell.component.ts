import { Component, Input } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {

  @Input() id!: number;
  cellPosibleValues: string[] = [' ', 'X', 'O'];
  cellValue: string = 'X';
  clickable: boolean = true;

  constructor(
    private gameController: GameControllerService
  ) { }

  ngOnInit(): void {

  }

  onClickEventHandler() {
    if (this.clickable)
      this.cellValue = this.cellPosibleValues[(this.cellPosibleValues.indexOf(this.cellValue) + 1) % this.cellPosibleValues.length];

    this.gameController.switchTurn();
  }

}
