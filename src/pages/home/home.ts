import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BksLoggerService } from '../../providers/logger-service/logger-service';
import { BksConfigurationService } from '../../providers/configuration-service/configuration-service';
import { LogLevel } from 'ionic-logging-service';
import { ToastController } from 'ionic-angular';
import { LoggingViewerFilterService } from '../viewer/logging-viewer-filter.service';
import { BksFileAppenderService } from '../../providers/file-appender-service/file-appender-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public level: any = '0';
  public maxMessagesToLogToFile: number = 0;
  public maxFilesToSave: number = 3;
  public messagesFromFile = [];
  public meassage: string = 'log something...';

  constructor(public navCtrl: NavController,
    private loggerService: BksLoggerService,
    public bksConfigurationService: BksConfigurationService,
    private loggingViewerFilterService: LoggingViewerFilterService,
    private toastCtrl: ToastController,
    public platform: Platform,
    private bksFileAppenderService: BksFileAppenderService) {

  }

  setLevel() {
    this.bksConfigurationService.setLogLevel(LogLevel[this.bksConfigurationService.loggerLevel]);
  }

  setMaxMessages() {
    this.bksConfigurationService.maxMessagesToLogToFile = this.maxMessagesToLogToFile;
    this.bksConfigurationService.setMaxMessaggesForLocalstorageAppender();
  }

  setMaxFilesToSave() {
    console.log(this.bksConfigurationService.maxFilesToSave);

  }

  sendByMail(){
    console.log('sendByMail');
  }

  warn() {
    this.loggerService.logWarn('warn', [this.meassage]);
  }

  info() {
    this.loggerService.logInfo('info', [this.meassage]);
  }

  error() {
    this.loggerService.logError('error', [this.meassage]);
  }

  debug() {
    this.loggerService.logDebug('debug', [this.meassage]);
  }

  getFile(ev) {
    const files: any[] = ev.target.files;
    console.log(files);
    let fReader = new FileReader();
    fReader.onerror = (e) => { this.toast(e) }
    for (let f of files) {
      fReader.onload = (ev) => {
        if (fReader.readyState === 2) {
          const result: any = fReader.result;
          try { this.messagesFromFile = this.messagesFromFile.concat(...JSON.parse(result)) }
          catch (e) { this.toast(e) }
        }
        
      }
      fReader.onloadend = ()=>{
        this.loggingViewerFilterService.filterChanged.emit();
      }
      fReader.readAsText(f);
    }
  }

  clearLogs(){
    console.log('clearLogs')
    this.messagesFromFile = [];
    setTimeout(()=>{this.loggingViewerFilterService.filterChanged.emit()}, 20); 
  }

  toast(msg){
    let t = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    t.present();


  }

}
