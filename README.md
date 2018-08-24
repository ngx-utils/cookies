# @ngx-utils/cookies

[![npm version](https://badge.fury.io/js/%40ngx-utils%2Fcookies.svg)](https://badge.fury.io/js/%40ngx-utils%2Fcookies) [![npm downloads](https://img.shields.io/npm/dm/@ngx-utils/cookies.svg)](https://www.npmjs.com/package/@ngx-utils/cookies)

Manage your cookies on client and server side (Angular Universal)

Example in [@ngx-utils/universal-starter](https://github.com/ngx-utils/universal-starter/blob/master/src/app/auth-http.service.ts#L68) shows the way in which `CookiesService` is used to get access token from cookies on client and **server side**, and then set Authorization headers for all HTTP requests.

## Table of contents:

* [Prerequisites](#prerequisites)
* [Getting started](#getting-started)
  * [Installation](#installation)
  * [browser.module.ts](#browsermodulets)
  * [server.module.ts](#servermodulets)
  * [Cookies options](#cookies-options)
* [API](#api)
* [Example of usage](#example-of-usage)
* [License](#license)

## Prerequisites

This package depends on `@angular v5.0.0`.

And if you want to manage cookies on server side and you're using express as server you need install:
`npm i -S cookie-parser @nguniversal/module-map-ngfactory-loader`

## Getting started

### Installation

Install **@ngx-utils/cookies** from npm:

```bash
npm install @ngx-utils/cookies --save
```

### browser.module.ts

Add **BrowserCookiesModule** to your browser module:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
...
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
...
@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'your-app-id'}),
    BrowserCookiesModule.forRoot(),
    AppModule
    ...
  ],
  bootstrap: [AppComponent]
})
export class BrowserAppModule { }
```

### server.module.ts

Add **ServerCookiesModule** to your server module:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { ServerCookiesModule } from '@ngx-utils/cookies/server';
...
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
...
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'your-app-id' }),
    ServerModule,
    ServerCookiesModule.forRoot(),
    AppModule
    ...
  ],
  bootstrap: [AppComponent]
})
export class ServerAppModule { }
```

### Cookies options

You can preset cookies options:

```ts
BrowserCookiesModule.forRoot({
  path: '/',
  domain: 'your.domain',
  expires: '01.01.2020',
  secure: true,
  httpOnly: true
})
...
ServerCookiesModule.forRoot({
  path: '/',
  domain: 'your.domain',
  expires: '01.01.2020',
  secure: true,
  httpOnly: true
})
```

## API

`CookieService` has following methods:

* `put(key: string, value: string, options?: CookiesOptions): void` put some value to cookies;
* `putObject(key: string, value: Object, options?: CookiesOptions): void` put object value to cookies;
* `get(key: string): string` get some value from cookies by `key`;
* `getObject(key: string): { [key: string]: string } | string` get object value from cookies by `key`;
* `getAll(): { [key: string]: string }` get all cookies ;
* `remove(key: string, options?: CookiesOptions): void` remove cookie by `key`;
* `removeAll(): void` remove all cookies;

## Example of usage

If you're using `express` as server then add following code to your `server.ts`:

```ts
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');


app.use(cookieParser('Your private token'));

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ],
}));
```

Then just import `CookiesService` from `@ngx-utils/cookies` and use it:

```ts
import { Component, OnInit } from '@angular/core';
import { CookiesService } from '@ngx-utils/cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private cookies: CookiesService) {}

  ngOnInit() {
    this.cookies.put('some_cookie', 'some_cookie');
    this.cookies.put('http_only_cookie', 'http_only_cookie', {
      httpOnly: true
    });
    console.log(this.cookies.get('some_cookie'), ' => some_cookie');
    console.log(this.cookies.get('http_only_cookie'), ' => undefined');
    console.log(this.cookies.getAll());
  }
}
```

If you're using another framework you need to overrride `ServerCookiesService`.

For example for `koa` you need add following code to your server:

```ts
app.use(async (ctx: Context) => {
  ctx.body = await renderModuleFactory(AppServerModuleNgFactory, {
    document: template,
    url: ctx.req.url,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
      {
        provide: 'KOA_CONTEXT',
        useValue: ctx
      }
    ]
  });
});
```

Then create `server-cookies.service.ts`:

```ts
import { Context } from 'koa';
import { Inject, Injectable } from '@angular/core';
import {
  CookiesService,
  CookiesOptionsService,
  CookiesOptions
} from '@ngx-utils/cookies';

@Injectable()
export class ServerCookiesService extends CookiesService {
  private newCookies: { [name: string]: string | undefined } = {};

  constructor(
    cookiesOptions: CookiesOptionsService,
    @Inject('KOA_CONTEXT') private ctx: Context
  ) {
    super(cookiesOptions);
  }

  get(key: string): string {
    return this.newCookies[key] || this.ctx.cookies.get(key);
  }

  protected cookiesReader() {
    return {};
  }

  protected cookiesWriter(): (
    name: string,
    value: string | undefined,
    options?: CookiesOptions
  ) => void {
    return (name: string, value: string | undefined, options?: any) => {
      this.newCookies[name] = value;
      this.ctx.cookies.set(name, value, { httpOnly: false, ...options });
    };
  }
}
```

And add `server-cookies.service.ts` to `app.server.module.ts`:

```ts
{
  provide: CookiesService,
  useClass: ServerCookiesService,
},
```

## License

The MIT License (MIT)
