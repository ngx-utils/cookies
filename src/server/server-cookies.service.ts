import { Inject, Injectable } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { CookiesOptions } from '../cookies-options';
import { CookiesOptionsService } from '../cookies-options.service';
import { CookiesService } from '../cookies.service';
import { isString, mergeOptions } from '../utils';

@Injectable()
export class ServerCookiesService extends CookiesService {
  private newCookies: { [name: string]: string | undefined } = {};

  constructor(
    cookiesOptions: CookiesOptionsService,
    @Inject(REQUEST) private request: Request,
    @Inject(RESPONSE) private response: Response
  ) {
    super(cookiesOptions);
  }

  protected cookiesReader(): { [key: string]: any } {
    const allCookies: { [key: string]: any } = {
      ...this.request.cookies,
      ...this.newCookies
    };
    const cookies: { [key: string]: any } = {};
    for (const name in allCookies) {
      if (typeof allCookies[name] !== 'undefined') {
        cookies[name] = decodeURIComponent(allCookies[name]);
      }
    }
    return cookies;
  }

  protected cookiesWriter(): (
    name: string,
    value: string | undefined,
    options?: CookiesOptions
  ) => void {
    return (
      name: string,
      value: string | undefined,
      options?: CookiesOptions
    ) => {
      this.newCookies[name] = value;
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
