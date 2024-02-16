import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
// eslint-disable-next-line node/no-unpublished-import
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CatsState } from './app/states/cats.state';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      NgxsModule.forRoot([CatsState], {
        developmentMode: true,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
    ),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
