import { Injectable } from '@angular/core';

import { CookiesOptions } from './cookies-options';
import { CookiesOptionsService } from './cookies-options.service';
import { isBlank, isString, mergeOptions, safeDecodeURIComponent, safeJsonParse } from './utils';

export interface ICookiesService {
  get(key: string): string;
  getObject(key: string): { [key: string]: string } | string;
  getAll(): { [key: string]: string };
  put(key: string, value: string, options?: CookiesOptions): void;
  putObject(key: string, value: { [key: string]: string }, options?: CookiesOptions): void;
  remove(key: string, options?: CookiesOptions): void;
  removeAll(): void;
}

@Injectable()
export class CookiesService implements ICookiesService {
  protected options: CookiesOptions;

  get cookieString(): string {
    return document.cookie || '';
  }

  set cookieString(val: string) {
    document.cookie = val;
  }

  constructor(cookiesOptions: CookiesOptionsService) {
    this.options = cookiesOptions.options;
  }

  get(key: string): string {
    return (<any>this.cookiesReader())[key];
  }

  getObject(key: string): { [key: string]: string } | string {
    const value = this.get(key);
    return value ? safeJsonParse(value) : value;
  }

  getAll(): { [key: string]: string } {
    return <any>this.cookiesReader();
  }

  put(key: string, value: string, options?: CookiesOptions): void {
    this.cookiesWriter()(key, value, options);
  }

  putObject(key: string, value: Object, options?: CookiesOptions): void {
    this.put(key, JSON.stringify(value), options);
  }

  remove(key: string, options?: CookiesOptions): void {
    this.cookiesWriter()(key, undefined, options);
  }

  removeAll(): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(key => {
      this.remove(key);
    });
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

