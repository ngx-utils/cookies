import { ModuleWithProviders, NgModule } from '@angular/core';

import { CookiesOptions } from './cookies-options';
import { COOKIES_OPTIONS, CookiesOptionsService } from './cookies-options.service';
import { CookiesService } from './cookies.service';
import { CookiesNodeService } from './cookies-node.service';

@NgModule()
export class CookiesModule {
  static forRoot(options: CookiesOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookiesModule,
      providers: [
        {provide: COOKIES_OPTIONS, useValue: options},
        CookiesOptionsService,
        CookiesService
      ]
    };
  }

  static forServerRoot(options: CookiesOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookiesModule,
      providers: [
        {provide: COOKIES_OPTIONS, useValue: options},
        CookiesOptionsService,
        {provide: CookiesService, useClass: CookiesNodeService}
      ]
    };
  }
}

