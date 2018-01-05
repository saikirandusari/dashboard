import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {RootModule} from "./index_module";

platformBrowserDynamic().bootstrapModule(RootModule).catch(err => console.log(err));
