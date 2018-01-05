import {ChromeComponent} from './component';
import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatIconModule, MatIconRegistry, MatProgressSpinnerModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";
import {HttpClientModule} from "@angular/common/http";
import {PipesModule} from "../common/pipes/module";
import {ServicesModule} from "../common/services/module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {chromeState} from "./state";
import {UIRouterModule} from "@uirouter/angular";
import {NavModule} from "./nav/module";

@NgModule({
  declarations: [
    ChromeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    PipesModule,
    ServicesModule,
    UIRouterModule.forRoot({
      states: [chromeState],
      useHash: true,
      otherwise: { state: 'about'},
    }),
    // Application modules
    NavModule,
  ],
  providers: [
    MatIconRegistry,
  ],
})
export class ChromeModule {
}
