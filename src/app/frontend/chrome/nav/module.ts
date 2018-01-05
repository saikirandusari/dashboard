import {NgModule} from "@angular/core";
import {NavComponent} from "./component";
import {MatButtonModule, MatSidenavModule} from "@angular/material";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavItemComponent} from "./item/component";

@NgModule({
  declarations: [NavComponent, NavItemComponent],
  exports: [NavComponent, NavItemComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
  ]
})
export class NavModule {
}
