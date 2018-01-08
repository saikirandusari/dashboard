import {Component, Inject, OnInit} from '@angular/core';
import {AssetsService} from "../common/services/assets";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'kd-chrome',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class ChromeComponent implements OnInit {
  loading: boolean = false;

  constructor(@Inject(AssetsService) public assets: AssetsService,
              private http_: HttpClient) {}

  public getOverviewStateName() {
    return 'someName';
  }

  public isSystemBannerVisible() {
    return false;
  }

  public create() {

  }

  public ngOnInit() {
    this.http_.get('api/v1/node').subscribe(
      data => console.log(data),
      err => console.error(err)
    )
  }
}
