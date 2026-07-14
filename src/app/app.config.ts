import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideMarkdown } from 'ngx-markdown';
import { NgxEchartsModule } from 'ngx-echarts';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown(),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts: () => import('echarts') }))
  ]
};
