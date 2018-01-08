import {Inject, Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class AssetsService {
  private readonly assetsPath = 'assets/images';
  private readonly appLogoSvg = 'kubernetes-logo.svg';
  private readonly appLogoTextSvg = 'kubernetes-logo-text.svg';
  private readonly appLogoIcon = 'kd-logo';
  private readonly appLogoTextIcon = 'kd-logo-text';

  constructor(@Inject(MatIconRegistry) iconRegistry: MatIconRegistry,
              @Inject(DomSanitizer) sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(this.appLogoIcon,
      sanitizer.bypassSecurityTrustResourceUrl(`${this.assetsPath}/${this.appLogoSvg}`));
    iconRegistry.addSvgIcon(this.appLogoTextIcon,
      sanitizer.bypassSecurityTrustResourceUrl(`${this.assetsPath}/${this.appLogoTextSvg}`));
  }

  public getAppLogo() {
    return this.appLogoIcon;
  }

  public getAppLogoText() {
    return this.appLogoTextIcon;
  }
}
