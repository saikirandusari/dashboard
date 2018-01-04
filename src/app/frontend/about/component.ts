import {Component, Inject, OnInit} from '@angular/core';
import {AssetsService} from "../common/services/assets";

@Component({
  selector: 'kd-about',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class AboutComponent implements OnInit {

  constructor(@Inject(AssetsService) public assets: AssetsService) {}

  ngOnInit() {
  }

}
