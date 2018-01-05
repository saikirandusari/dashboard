import {CommonModule} from '@angular/common';
import {MatCardModule, MatGridListModule, MatIconModule} from "@angular/material";
import {NgModule} from '@angular/core';
import {UIRouterModule} from "@uirouter/angular";

import {AboutComponent} from './component';
import {aboutState} from "./state";
import {ServicesModule} from "../common/services/module";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    ServicesModule,
    UIRouterModule.forChild({states: [aboutState]}),
  ],
  declarations: [AboutComponent],
})
export class AboutModule {
}
