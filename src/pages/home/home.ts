import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BksLoggerService } from '../../providers/logger-service/logger-service';
import { BksConfigurationService } from '../../providers/configuration-service/configuration-service';
import { LogLevel } from 'ionic-logging-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public level: any = '0';
  public maxMessagesToLogToFile: number = 0;
  public daysToSaveFiles: number = 3;

  constructor(public navCtrl: NavController, private loggerService : BksLoggerService, public bksConfigurationService: BksConfigurationService) {
    console.log(this.bksConfigurationService.loggerLevel);
    this.level = LogLevel[this.bksConfigurationService.loggerLevel];
  }

  setLevel(){
    this.bksConfigurationService.setLogLevel(this.level);
  }

  setMaxMessages(){
    this.bksConfigurationService.maxMessagesToLogToFile = this.maxMessagesToLogToFile;
    this.bksConfigurationService.setMaxMessaggesForLocalstorageAppender();
  }

  setDaysToSaveFiles(){

  }

  warn(){
    this.loggerService.logWarn('warn', ['warn log data']);
  }

  info(){
    this.loggerService.logInfo('info', ['info log data']);
  }

  error(){
    this.loggerService.logError('error', ['error log data']);
  }

  debug(){
    this.loggerService.logDebug('debug', ['debug log data']);
  }

}
