# @ngx-utils/cookies

[![npm version](https://badge.fury.io/js/%40ngx-utils%2Fcookies.svg)](https://badge.fury.io/js/%40ngx-utils%2Fcookies) [![npm downloads](https://img.shields.io/npm/dm/@ngx-utils/cookies.svg)](https://www.npmjs.com/package/@ngx-utils/cookies)

Manage your cookies on client and server side (Angular Universal) (example [@ngx-utils/universal-starter](https://github.com/ngx-utils/universal-starter))

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
    - [Installation](#installation)
    - [browser.module.ts](#browsermodulets)
    - [server.module.ts](#servermodulets)
    - [Cookies options](#cookies-options)
- [API](#api)
- [Example of usage](#example-of-usage)
- [License](#license)

## Prerequisites

This package depends on `@angular v4.0.0`, `@ngx-utils/express-engine` and `cookie-parser`.

Install `@ngx-utils/express-engine` and `cookie-parser` from npm:
```bash
npm install @ngx-utils/express-engine cookie-parser --save
```

And add cookie parser middlewear to you **server.ts** that should looks like this:
```ts
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@ngx-utils/express-engine';

import { ServerAppModuleNgFactory } from './ngfactory/server.module.ngfactory';
import { environment } from './environments/environment';

const app = express();

enableProdMode();

app.use(cookieParser('Your private token'));

app.engine('html', ngExpressEngine({
  aot: true,
  bootstrap: ServerAppModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'dist/client');

app.get('*', (req, res) => {
  res.render('../client/index', {cache: true, req, res});
});

app.listen(environment.port);

```

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
- `put(key: string, value: string, options?: CookiesOptions): void` put some value to cookies;
- `putObject(key: string, value: Object, options?: CookiesOptions): void` put object value to cookies;
- `get(key: string): string` get some value from cookies by `key`;
- `getObject(key: string): { [key: string]: string } | string` get object value from cookies by `key`;
- `getAll(): { [key: string]: string }` get all cookies ;
- `remove(key: string, options?: CookiesOptions): void` remove cookie by `key`;
- `removeAll(): void` remove all cookies;

## Example of usage

Just import `CookiesService` from `@ngx-utils/cookies` and use it:

```ts
import { Component, OnInit} from '@angular/core';
import { CookiesService } from '@ngx-utils/cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private cookies: CookiesService) { }

  ngOnInit() {
    this.cookies.put('some_cookie', 'some_cookie');
    this.cookies.put('http_only_cookie', 'http_only_cookie', {httpOnly: true});
    console.log(this.cookies.get('some_cookie'), ' => some_cookie');
    console.log(this.cookies.get('http_only_cookie'), ' => undefined');
    console.log(this.cookies.getAll());
  }
}


```

## License

The MIT License (MIT)
