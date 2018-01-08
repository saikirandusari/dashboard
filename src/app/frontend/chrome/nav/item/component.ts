import {Component} from "@angular/core";

@Component({
  selector: 'kd-nav-item',
  templateUrl: 'template.html',
  styleUrls: ['style.scss'],
})
export class NavItemComponent {
  public getHref() {
    return 'test';
  }

  isActive() {
    return false;
  }
}
