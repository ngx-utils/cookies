import { Inject, Injectable } from '@angular/core';

import { CookiesService } from './cookies.service';
import { CookiesOptionsService } from './cookies-options.service';
import { CookiesOptions } from './cookies-options';
import { isString, mergeOptions } from './utils';

@Injectable()
export class CookiesNodeService extends CookiesService {
  constructor(cookiesOptions: CookiesOptionsService,
              @Inject('REQUEST') private request: any,
              @Inject('RESPONSE') private response: any) {
    super(cookiesOptions);
  }

  protected cookiesReader(): { [key: string]: any } {
    return this.request.cookies;
  }

  protected cookiesWriter(): (name: string, value: string | undefined, options?: CookiesOptions) => void {
    return (name: string, value: string | undefined, options?: CookiesOptions) => {
      this.response.cookie(name, value, this.buildCookiesOptions(options));
    };
  }

  private buildCookiesOptions(options?: CookiesOptions): CookiesOptions {
    let opts: CookiesOptions = mergeOptions(this.options, options);
    if (isString(opts.expires)) {
      opts.expires = new Date(opts.expires);
    }
    return opts;
  }
}
