import {AfterContentInit, Component, ViewChild} from "@angular/core";
import {MatDrawer} from "@angular/material";

@Component({
  selector: 'kd-nav',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
})
export class NavComponent implements AfterContentInit {
  @ViewChild(MatDrawer)
  private sidenav_: MatDrawer;

  ngAfterContentInit() {
    this.sidenav_.open();
  }
}
