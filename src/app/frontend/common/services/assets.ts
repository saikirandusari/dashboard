import {Inject, Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class AssetsService {
  private assetsPath = 'assets/images';
  private appLogoSvg = 'kubernetes-logo.svg';
  private appLogoPng = 'kubernetes-logo.png';
  private appLogoTextSvg = 'kubernetes-logo-text.svg';

  private appLogoIcon = 'kd-logo';
  private appLogoTextIcon = 'kd-logo-text';

  constructor(@Inject(MatIconRegistry) iconRegistry: MatIconRegistry,
              @Inject(DomSanitizer) sanitizer: DomSanitizer) {
    // Register icons
    iconRegistry.addSvgIcon(this.appLogoIcon,
      sanitizer.bypassSecurityTrustResourceUrl(`${this.assetsPath}/${this.appLogoSvg}`));

    iconRegistry.addSvgIcon(this.appLogoTextIcon,
      sanitizer.bypassSecurityTrustResourceUrl(`${this.assetsPath}/${this.appLogoTextSvg}`))
  }

  public getAppLogo() {
    return this.appLogoIcon;
  }

  public getAppLogoText() {
    return this.appLogoTextIcon;
  }
}
