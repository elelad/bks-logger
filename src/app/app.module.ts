import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule  } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { LoggingService } from 'ionic-logging-service';
import { SocialSharing } from '@ionic-native/social-sharing';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BksLoggerService } from '../providers/logger-service/logger-service';
import { BksFileAppenderService } from '../providers/file-appender-service/file-appender-service';
import { BksConfigurationService } from '../providers/configuration-service/configuration-service';
import { LoggingViewerModule } from '../pages/viewer/logging-viewer.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.DEBUG}),
    LoggingViewerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    BksConfigurationService,
    BksFileAppenderService,
    LoggingService,
    BksLoggerService,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
