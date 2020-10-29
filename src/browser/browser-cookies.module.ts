import { ModuleWithProviders, NgModule } from "@angular/core";
import { CookiesOptions } from "../cookies-options";
import {
  CookiesOptionsService,
  COOKIES_OPTIONS
} from "../cookies-options.service";
import { CookiesService } from "../cookies.service";
import { BrowserCookiesService } from "./browser-cookies.service";

@NgModule()
export class BrowserCookiesModule {
  static forRoot(options: CookiesOptions = {}): ModuleWithProviders<BrowserCookiesModule> {
    return {
      ngModule: BrowserCookiesModule,
      providers: [
        { provide: COOKIES_OPTIONS, useValue: options },
        CookiesOptionsService,
        { provide: CookiesService, useClass: BrowserCookiesService }
      ]
    };
  }
}
