import { ModuleWithProviders, NgModule } from "@angular/core";
import { CookiesOptions } from "../cookies-options";
import {
  CookiesOptionsService,
  COOKIES_OPTIONS
} from "../cookies-options.service";
import { CookiesService } from "../cookies.service";
import { ServerCookiesService } from "./server-cookies.service";

@NgModule()
export class ServerCookiesModule {
  static forRoot(options: CookiesOptions = {}): ModuleWithProviders<ServerCookiesModule> {
    return {
      ngModule: ServerCookiesModule,
      providers: [
        { provide: COOKIES_OPTIONS, useValue: options },
        CookiesOptionsService,
        { provide: CookiesService, useClass: ServerCookiesService }
      ]
    };
  }
}
