import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {UIView} from "@uirouter/angular";
import {ChromeModule} from "./chrome/module";
import {AboutModule} from "./about/module";

@NgModule({
  imports: [
    BrowserModule,
    // Application modules
    ChromeModule,
    AboutModule,
  ],
  bootstrap: [UIView]
})
export class RootModule {}
