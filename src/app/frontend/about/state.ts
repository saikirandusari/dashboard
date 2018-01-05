import {Ng2StateDeclaration} from "@uirouter/angular";
import {AboutComponent} from "./component";
import {stateName as chromeState} from "../chrome/state";

export const aboutState: Ng2StateDeclaration = {
  parent: chromeState,
  name: 'about',
  url: '/about',
  component: AboutComponent,
};
