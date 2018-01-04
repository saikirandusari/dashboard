import {Component, Inject} from '@angular/core';
import {AssetsService} from "../common/services/assets";

@Component({
  selector: 'kd-chrome',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class ChromeComponent {

  constructor(@Inject(AssetsService) public assets: AssetsService) {}

  public getOverviewStateName() {
    return 'someName';
  }
}
