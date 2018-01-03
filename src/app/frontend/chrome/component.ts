import { Component } from '@angular/core';

@Component({
  selector: 'kd-chrome',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class ChromeComponent {
  title = 'app';

  getOverviewStateName() {
    return 'someName';
  }
}
