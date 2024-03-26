import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCekx0QHxbf1x0ZF1MY11bRXNPMyBoS35RckVgW3leeHdUR2ZZVUV1')

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


