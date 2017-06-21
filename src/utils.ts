import { CookiesOptions } from './cookies-options';

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function mergeOptions(oldOptions: CookiesOptions, newOptions?: CookiesOptions): CookiesOptions {
  if (!newOptions) {
    return oldOptions;
  }
  return {
    path: isPresent(newOptions.path) ? newOptions.path : oldOptions.path,
    domain: isPresent(newOptions.domain) ? newOptions.domain : oldOptions.domain,
    expires: isPresent(newOptions.expires) ? newOptions.expires : oldOptions.expires,
    secure: isPresent(newOptions.secure) ? newOptions.secure : oldOptions.secure,
  };
}

export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}

export function safeJsonParse(str: string): { [key: string]: any } | string {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}