import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './component';
import {MatCardModule, MatGridListModule, MatIconModule} from "@angular/material";
import {ServicesModule} from "../common/services/module";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ServicesModule,
    MatGridListModule,
  ],
  declarations: [AboutComponent]
})
export class AboutModule { }
