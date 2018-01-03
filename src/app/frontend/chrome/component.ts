import {Component, Inject} from '@angular/core';
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'kd-chrome',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class ChromeComponent {
  title = 'app';

  constructor(
    @Inject(MatIconRegistry) iconRegistry: MatIconRegistry,
    @Inject(DomSanitizer) sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('kd-logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/kubernetes-logo.svg'));
  }

  getOverviewStateName() {
    return 'someName';
  }
}
