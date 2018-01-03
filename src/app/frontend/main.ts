import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {ChromeModule} from './chrome/module';

platformBrowserDynamic().bootstrapModule(ChromeModule).catch(err => console.log(err));
