import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { CookiesOptions } from './cookies-options';
import { mergeOptions } from './utils';

export const COOKIES_OPTIONS = new InjectionToken('COOKIES_OPTIONS');

@Injectable()
export class CookiesOptionsService {
  private defaultOptions: CookiesOptions;
  private _options: CookiesOptions;

  constructor(@Inject(COOKIES_OPTIONS) options: CookiesOptions = {},
              private injector: Injector) {
    this.defaultOptions = {
      path: this.injector.get(APP_BASE_HREF, '/'),
      domain: null,
      expires: null,
      secure: false
    };
    this._options = mergeOptions(this.defaultOptions, options);
  }

  get options(): CookiesOptions {
    return this._options;
  }
}
