export interface CookiesOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date | boolean;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean | 'auto';
  encode?: (val: string) => void;
  sameSite?: boolean | string;
}
