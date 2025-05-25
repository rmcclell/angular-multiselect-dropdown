// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Often needed in modern apps

bootstrapApplication(AppComponent, {
  providers: [
    // If you use HttpClient, configure it here
    // provideHttpClient(withFetch()),
  ]
}).catch(err => console.error(err));