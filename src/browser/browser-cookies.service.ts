import { Injectable } from '@angular/core';

import { CookiesService } from '../cookies.service';
import { CookiesOptions } from '../cookies-options';
import { CookiesOptionsService } from '../cookies-options.service';
import { isBlank, isString, mergeOptions, safeDecodeURIComponent } from '../utils';

@Injectable()
export class BrowserCookiesService extends CookiesService {
  get cookieString(): string {
    return document.cookie || '';
  }

  set cookieString(val: string) {
    document.cookie = val;
  }

  constructor(cookiesOptions: CookiesOptionsService) {
    super(cookiesOptions);
  }

  protected cookiesReader(): { [key: string]: any } {
    let lastCookies = {};
    let lastCookieString = '';
    let cookiesArray: string[], cookie: string, i: number, index: number, name: string;
    let currentCookieString = this.cookieString;
    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookiesArray = lastCookieString.split('; ');
      lastCookies = {};
      for (i = 0; i < cookiesArray.length; i++) {
        cookie = cookiesArray[i];
        index = cookie.indexOf('=');
        if (index > 0) {  // ignore nameless cookies
          name = safeDecodeURIComponent(cookie.substring(0, index));
          if (isBlank((<any>lastCookies)[name])) {
            (<any>lastCookies)[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }
    return lastCookies;
  }

  protected cookiesWriter(): (name: string, value: string | undefined, options?: CookiesOptions) => void {
    return (name: string, value: string | undefined, options?: CookiesOptions) => {
      this.cookieString = this.buildCookieString(name, value, options);
    };
  }

  private buildCookieString(name: string, value: string | undefined, options?: CookiesOptions): string {
    let opts: CookiesOptions = mergeOptions(this.options, options);
    let expires: any = opts.expires;
    if (isBlank(value)) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (isString(expires)) {
      expires = new Date(expires);
    }
    let str = encodeURIComponent(name) + '=' + encodeURIComponent((value as string));
    str += opts.path ? ';path=' + opts.path : '';
    str += opts.domain ? ';domain=' + opts.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += opts.secure ? ';secure' : '';
    let cookiesLength = str.length + 1;
    if (cookiesLength > 4096) {
      console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too
      large (${cookiesLength} > 4096 bytes)!`);
    }
    return str;
  }
}
