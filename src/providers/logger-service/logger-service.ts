import { Injectable } from '@angular/core';
import { Logger, LoggingService, LogLevel, AjaxAppender } from "ionic-logging-service";
import { AjaxAppenderConfiguration } from 'ionic-logging-service/dist/ajax-appender.configuration';
import { MemoryAppender } from 'ionic-logging-service/dist/memory-appender.model';
//import { LocalStorageAppender } from 'ionic-logging-service/dist/local-storage-appender.model';
//import config from '../../assets/settings.json';
//import { LocalStorageAppenderConfiguration } from 'ionic-logging-service/dist/local-storage-appender.configuration';
//import { BrowserConsoleAppender } from 'log4javascript';
import { Platform } from 'ionic-angular';
import { SystemSettings } from '../configuration-service/custom-configuration.model';
import { BksFileAppenderService } from '../file-appender-service/file-appender-service';

import { BksConfigurationService } from '../configuration-service/configuration-service';



@Injectable()
export class BksLoggerService {
	private logger: Logger;
	private loggerState;
	private memoryAppender: MemoryAppender;
	private systemSettings: SystemSettings;
	private fileAppender = {
		"batchSize": 3,
		"threshold": "ERROR"
	}

	



	constructor(private loggingService: LoggingService,
		private platfom: Platform,
		private fileAppenderService: BksFileAppenderService,
		private bksConfigurationService: BksConfigurationService) {
		
	}

	initConfig() {
		this.logger = this.loggingService.getLogger('BKS.FOX');
		//this.loggerState = this.config.logging;
		this.loggerState.logger = this.loggingService.getLogger('BKS.FOX');
		const ajaxSetting: AjaxAppenderConfiguration = {
			"url": "/logger/writeLog",
			"timerInterval": 0,
			"batchSize": 1,
			"threshold": "ERROR"
		} // this.config.logging.ajaxAppender
		this.loggingService.configure({ ajaxAppender: ajaxSetting });
		const appenders = this.logger.getInternalLogger().getEffectiveAppenders();
		this.memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;
		this.memoryAppender.setOnLogMessagesChangedCallback(this.onLogMessagesChanged.bind(this))
		this.logger.setLogLevel(LogLevel.ALL);
	}

	onLogMessagesChanged(msg) {
		console.log(msg);
		//console.log(this.memoryAppender.getLogMessages());
		if (this.memoryAppender.getLogMessages().length > this.fileAppender.batchSize - 1){
			this.fileAppenderService.writeToLogFile(this.memoryAppender.getLogMessages())
		}
	}

	setLogLevel(l: string) {
		this.bksConfigurationService.loggerState.logger.setLogLevel(LogLevel[l]);
	}

	writeLog(methodName: string, params?: any[]) {

		
		const logLevel = this.bksConfigurationService.loggerState.logger.getLogLevel().toString()
		switch (logLevel) {
			case "ALL":
				this.logDebug(methodName, params);
				break;
			case "DEBUG":
				this.logDebug(methodName, params);
				break;
			case "INFO":
				this.logInfo(methodName, params);
				break;
			case "WARN":
				this.logWarn(methodName, params);
				break;
			case "ERROR":
				//   this.logError(`Method ${methodName} 
				//             Error Message ${params.message}
				//             Error Stack ${params.stack}
				//             Error ${JSON.parse(JSON.stringify(params))}`);
				this.logError(methodName, params);
				break;
			default:
				this.logDebug(methodName, params);
				break;
		}
	}


	public logDebug(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.debug(methodName, ...params);
		//this.logger.debug(methodName, params);
	}

	public logInfo(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.info(methodName, ...params);
		//this.logger.info(methodName, params);
	}

	public logWarn(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.warn(methodName, ...params);
		//this.logger.warn(methodName, params);
	}

	public logError(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.error(methodName, ...params);
		//this.logger.error(methodName, params);
	}

	public logEntry(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.entry(methodName, ...params);
		//this.logger.entry(methodName, params);
	}

	public logExit(methodName: string, params?: any[]): void {
		this.bksConfigurationService.loggerState.logger.entry(methodName, ...params);
		//this.logger.entry(methodName, params);
	}
}

//  this.bksLoggerService.logError(this.systemSettings.logger, methodName, ["Error getting configuration!", error]);
//this.bksLoggerService.logExit(this.systemSettings.logger, methodName);