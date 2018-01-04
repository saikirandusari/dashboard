import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from "../../about/component";
import {AboutModule} from "../../about/module";


const routes: Routes = [
  {path: 'about', component: AboutComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
    AboutModule
  ],
})
export class RoutingModule {
}


