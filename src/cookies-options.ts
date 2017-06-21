export interface CookiesOptions {
  path?: string | null;
  domain?: string | null;
  expires?: string | Date | null;
  secure?: boolean | null;
  httpOnly?: boolean | null;
}
