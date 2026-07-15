import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideMarkdown } from 'ngx-markdown';
import { NgxEchartsModule } from 'ngx-echarts';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockInterceptor } from './core/interceptors/mock.interceptor';
import { initMockFetch } from './core/interceptors/mock-fetch';
import { environment } from '../environments/environment';

// Initialize fetch override if Mock Mode is enabled
if (environment.useMockMode) {
  initMockFetch();
}

const interceptors = [authInterceptor];
if (environment.useMockMode) {
  interceptors.unshift(mockInterceptor);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors(interceptors)),
    provideMarkdown(),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts: () => import('echarts') }))
  ]
};
