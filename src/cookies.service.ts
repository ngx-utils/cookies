import { Injectable } from '@angular/core';

import { CookiesOptions } from './cookies-options';
import { CookiesOptionsService } from './cookies-options.service';
import { safeJsonParse } from './utils';

@Injectable()
export class CookiesService {
  protected options: CookiesOptions;

  constructor(cookiesOptions: CookiesOptionsService) {
    this.options = cookiesOptions.options;
  }

  put(key: string, value: string, options?: CookiesOptions): void {
    this.cookiesWriter()(key, value, options);
  }

  putObject(key: string, value: Object, options?: CookiesOptions): void {
    this.put(key, JSON.stringify(value), options);
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
    return { };
  }

  protected cookiesWriter(): (name: string, value: string | undefined, options?: CookiesOptions) => void {
    return () => { };
  }
}
