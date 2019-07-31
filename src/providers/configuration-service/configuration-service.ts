import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import { Events, Platform } from 'ionic-angular';
//import { ConfigurationService } from 'ionic-configuration-service';
import { AjaxAppender, LoggingService, LogLevel } from 'ionic-logging-service';
import { LocalStorageAppenderConfiguration } from 'ionic-logging-service/dist/local-storage-appender.configuration';
import { LocalStorageAppender } from 'ionic-logging-service/dist/local-storage-appender.model';
import { BrowserConsoleAppender } from 'log4javascript';
import { MemoryAppender } from 'ionic-logging-service/dist/memory-appender.model';
//import * as moment from 'moment';
//import { ChangePasswordPolicy } from '../../components/change-password/change-password.model';
//import { ExamFlagedQuestion } from '../../components/evaluations-tools/exam/examQuestionMenu/model/examFlagedQuestions';
//import { BksLocalStorageService } from '../local-storage-service/local-storage-service';
//import { BksNetworkService } from '../network-service/network-service';
import { Component, LoggerState, PlatformType } from './custom-configuration.model'; //ConfigEvents, ConfigExamEvents, ConnectionStatus, CustomerImages, API, AuthenticationMode, StorageKeys, LoginType, ModalDialogs, Pages, SystemSettings
import { BksFileAppenderService } from '../file-appender-service/file-appender-service';




@Injectable()
export class BksConfigurationService {
	private systemSettings: any = {};
	private logsCounter: number = 0;


	private _loggerState: LoggerState;
	public get loggerState(): LoggerState {
		return this._loggerState;
	}
	public set loggerState(value: LoggerState) {
		this._loggerState = value;
	}

	private _loggerLevel: LogLevel = 0;
	public get loggerLevel(): LogLevel {
		return this._loggerLevel;
	}
	public set loggerLevel(value: LogLevel) {
		this._loggerLevel = value;
	}

	private _maxMessagesToLogToFile: number = 0;
	public get maxMessagesToLogToFile(): number {
		return this._maxMessagesToLogToFile;
	}
	public set maxMessagesToLogToFile(value: number) {
		this._maxMessagesToLogToFile = value;
	}

	private _maxFilesToSave: number = 3;
	public get maxFilesToSave(): number {
		return this._maxFilesToSave;
	}
	public set maxFilesToSave(value: number) {
		this._maxFilesToSave = value;
	}

	component: Component;

	private config = {
		logging: {
			logLevels: [
				{
					loggerName: "FoxLogger_ALL",
					logLevel: "ALL"
				},
				{
					loggerName: "FoxLogger_DEBUG",
					logLevel: "DEBUG"
				},
				{
					loggerName: "FoxLogger_INFO",
					logLevel: "INFO"
				},
				{
					loggerName: "FoxLogger_WARN",
					logLevel: "WARN"
				},
				{
					loggerName: "FoxLogger_ERROR",
					logLevel: "ERROR"
				},
				{
					loggerName: "FoxLogger_OFF",
					logLevel: "OFF"
				}
			],
			localStorageAppender: {
				localStorageKey: "FoxLogger_localStorageAppender",
				maxMessages: 1000,
				threshold: "ALL"
			},
			browserConsoleAppender: {
				threshold: "ALL",
				name: ''
			},
			ajaxAppender: {
				url: "/logger/writeLog",
				timerInterval: 0,
				batchSize: 3,
				threshold: "ERROR"
			},
			fileAppender: {
				batchSize: 4,
				threshold: "ALL"
			}
		}
	}

	constructor(//private configurationService: ConfigurationService,
		private platform: Platform,
		// private bksAuthService: BksAuthService,
		public events: Events,
		private loggingService: LoggingService,
		private fileAppenderService: BksFileAppenderService,
	) {
		this.platform.ready().then(() => {
			this.getPlatformInfo();
			this.initAppConfiguration();
			this.fileAppenderService.createBksLogFolder();
		})
	}

	/**
	 * Get Platform type
	 *
	 * @returns {PlatformType}
	 * @memberof BksConfigurationService
	 */
	getPlatformInfo(): PlatformType {
		if (this.platform.is('mobileweb') || this.platform.is('core')) {
			this.systemSettings.platformType = PlatformType.Browser; //PlatformType.Mobile; // TEST ONLY !!!!!
			this.systemSettings.realPlatformType = PlatformType.Browser;
		}
		else {
			this.systemSettings.platformType = PlatformType.Mobile;
			this.systemSettings.realPlatformType = PlatformType.Mobile;
		}
		if (this.platform.is('cordova')) {
			this.systemSettings.supportCordova = true;
		} else {
			this.systemSettings.supportCordova = false;
		}
		return this.systemSettings.platformType;
	}


	/**
	 * Initialize configuration service from environments settings.json , platform type and logger
	 *
	 * @returns {Promise<boolean>}
	 * @memberof BksConfigurationService
	 */
	async initAppConfiguration(): Promise<boolean> {

		const methodName = "initAppConfiguration";

		try {

			// const configurationLoad = await this.loadConfiguration();
			this.loggerState = this.config.logging;
			const configurationLoad = true;

			if (configurationLoad) {

				/* this.systemSettings = this.configurationService.getValue<SystemSettings>('SystemSettings');
				this.API = this.configurationService.getValue<API>('API');
				this.configEvents = this.configurationService.getValue<ConfigEvents>('ConfigEvents');
				this.storageKeys = this.configurationService.getValue<StorageKeys>('StorageKeys');
				this.loggerState = this.configurationService.getValue<LoggerState>('logging');
				this.pages = this.configurationService.getValue<Pages>('Pages');
				this.modalDialogs = this.configurationService.getValue<ModalDialogs>('ModalDialogs');
				this.customerImages = this.configurationService.getValue<CustomerImages>('CustomerImages');
				this.component = this.configurationService.getValue<Component>('component'); */

				// check platform type so we can load proper configuration (in mobile we need to check first the local storage)
				const PlatformType: PlatformType = await this.getPlatformInfo();
				console.log(methodName, 'Current Platform ' + PlatformType);

				const loggerInit: boolean = await this.setLogger();
				if (loggerInit === true) {
					console.log(methodName, 'logger init successfully');
				}
				else {
					console.log(methodName, 'logger init FAILED');
				}
				return true;
			}
		}
		catch (error) {
			console.log(methodName, [error]);
			return false;
		}

	}

	/**
	 * Set Logger appender in mobile device we work in offline mode so logging we store in LocalStorageAppender or BrowserConsoleAppender
	 * in browser logging stored in AjaxAppender (server) or BrowserConsoleAppender
	 *
	 * @returns {Promise<boolean>}
	 * @memberof BksConfigurationService
	 */
	async setLogger(): Promise<boolean> {

		const methodName = "setLogger";

		try {

			const appenders = this.loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();
			console.log(appenders);

			//const memoryAppender = appenders.find((a) => a.toString() === "Ionic.Logging.MemoryAppender") as MemoryAppender;
			//memoryAppender.setOnLogMessagesChangedCallback(this.onLogMessagesChanged.bind(this));
			this.loggingService.logMessagesChanged.subscribe(() => {
				console.log(this.loggingService.getLogMessages());
				this.onLogMessagesChanged();
			})

			this.maxMessagesToLogToFile = this.loggerState.fileAppender.batchSize;

			this.setMaxMessaggesForLocalstorageAppender();
			this.resetLogsCounter();

			if (this.systemSettings.platformType === PlatformType.Mobile) {
				//#region Mobile (in mobile we work offline mode)
				//let localStorageAppender = appenders.find((a) => a.toString() === "Ionic.Logging.LocalStorageAppender")
				//if (localStorageAppender) {
				// add appender
				//this.resatLogsCounter();
				const localStorageAppender = new LocalStorageAppender({
					localStorageKey: this.loggerState.localStorageAppender.localStorageKey,
					maxMessages: this.loggerState.fileAppender.batchSize,
					threshold: this.loggerState.localStorageAppender.threshold
				} as LocalStorageAppenderConfiguration);
				this.loggingService.getRootLogger().getInternalLogger().addAppender(localStorageAppender);
				this.setLogLevel(this.loggerState.localStorageAppender.threshold);
				//}
				//else {
				/* const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender") as BrowserConsoleAppender;
				if (browserConsoleAppender) {
					this.loggingService.getRootLogger().getInternalLogger().addAppender(browserConsoleAppender);
					this.setLogLevel(this.loggerState.browserConsoleAppender.threshold);
				} */
				//}


				//#endregion
			}
			else {
				//#region Browser
				let ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;
				console.log('ajaxAppender', ajaxAppender);
				//if (ajaxAppender) {
				// add appender
				ajaxAppender = new AjaxAppender({
					batchSize: this.loggerState.ajaxAppender.batchSize,
					threshold: this.loggerState.ajaxAppender.threshold,
					url: this.loggerState.ajaxAppender.url,
					timerInterval: this.loggerState.ajaxAppender.timerInterval

				});
				this.loggingService.getRootLogger().getInternalLogger().addAppender(ajaxAppender);
				this.setLogLevel(this.loggerState.ajaxAppender.threshold)
				//}
				//else {
				/* const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender") as BrowserConsoleAppender;
				if (browserConsoleAppender) {
					this.loggingService.getRootLogger().getInternalLogger().addAppender(browserConsoleAppender);
					this.setLogLevel(this.loggerState.browserConsoleAppender.threshold);
				} */
				//}
				//#endregion
			}
			return true
		}
		catch (error) {
			console.log(methodName, [error]);
			return false
		}

	}

	

	/**
	 * Set Log level ALL | DEBUG | INFO | WARN | ERROR | OFF
	 *
	 * @param {string} threshold
	 * @returns {Promise<boolean>}
	 * @memberof BksConfigurationService
	 */
	async setLogLevel(threshold: string | number): Promise<boolean> {
		

		const methodName = "setLogLevel";
		this.loggerLevel = LogLevel[threshold];
		console.log('this.loggerLevel', this.loggerLevel);


		try {

			let loggerName = "FoxLogger_";
			let logLevel: LogLevel;
			switch (threshold) {
				case "ALL":
					logLevel = LogLevel.ALL;
					loggerName += "ALL";
					console.log(methodName, 'Log name ' + loggerName);
					break;
				case "DEBUG":
					logLevel = LogLevel.DEBUG;
					loggerName += "DEBUG";
					console.log(methodName, 'Log name ' + loggerName);
					break;
				case "INFO":
					logLevel = LogLevel.INFO;
					loggerName += "INFO";
					console.log(methodName, 'Log name ' + loggerName);
					break;
				case "WARN":
					logLevel = LogLevel.WARN;
					loggerName += "WARN";
					console.log(methodName, 'Log name ' + loggerName);
					break;
				case "ERROR":
					logLevel = LogLevel.ERROR;
					loggerName += "ERROR";
					console.log(methodName, 'Log name ' + loggerName + "ERROR");
					break;
				default:
					logLevel = LogLevel.OFF;
					loggerName + "OFF";
					console.log(methodName, 'Log name ' + loggerName + "OFF");
					break;
			}
			const logger = await this.loggingService.getLogger(loggerName);
			logger.setLogLevel(logLevel);

			console.log(methodName, 'Log level ' + logLevel);
			this.loggerState.logger = logger;

			return true;
		}
		catch (error) {
			console.log(methodName, [error]);
			return false
		}
	}

	resetLogsCounter() {
		const messages = JSON.parse(localStorage.getItem(this.loggerState.localStorageAppender.localStorageKey));
		if (messages){
			this.fileAppenderService.writeToLogFile(messages);
			localStorage.removeItem(this.loggerState.localStorageAppender.localStorageKey);
		}
		this.logsCounter = 0;
		console.log('this.logsCounter', this.logsCounter);
	}

	onLogMessagesChanged() {
		this.logsCounter++;
		console.log(this.maxMessagesToLogToFile);
		const maxToLog = (this.maxMessagesToLogToFile == 0) ? this.loggerState.fileAppender.batchSize : this.maxMessagesToLogToFile;
		if (this.logsCounter >= maxToLog) {
			this.logsCounter = 0;
			this.logToFile();
		}
	}

	logToFile() {
		const messages = this.loggingService.getLogMessages();
		this.fileAppenderService.writeToLogFile(messages);
	}

	setMaxMessaggesForLocalstorageAppender() {
		this.loggingService.configure({
			localStorageAppender: {
				localStorageKey: this.loggerState.localStorageAppender.localStorageKey,
				maxMessages: this.maxMessagesToLogToFile,
				threshold: this.loggerState.localStorageAppender.threshold
			},
			memoryAppender: {
				maxMessages: this.maxMessagesToLogToFile,
				threshold: this.loggerState.localStorageAppender.threshold
			}
		});
	}


}


/* 
async setLoggerOriginal(): Promise<boolean> {

		const methodName = "setLogger";

		try {

			const appenders = this.loggingService.getRootLogger().getInternalLogger().getEffectiveAppenders();

			if (this.systemSettings.platformType === PlatformType.Mobile) {
				//#region Mobile (in mobile we work offline mode)
				let localStorageAppender = appenders.find((a) => a.toString() === "Ionic.Logging.LocalStorageAppender")
				if (localStorageAppender) {
					// add appender
					localStorageAppender = new LocalStorageAppender({
						localStorageKey: this.loggerState.localStorageAppender.localStorageKey,
						maxMessages: this.loggerState.localStorageAppender.maxMessages,
						threshold: this.loggerState.localStorageAppender.threshold
					} as LocalStorageAppenderConfiguration);
					this.loggingService.getRootLogger().getInternalLogger().addAppender(localStorageAppender);
					this.setLogLevel(this.loggerState.localStorageAppender.threshold);

				}
				else {
					const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender") as BrowserConsoleAppender;
					if (browserConsoleAppender) {
						this.loggingService.getRootLogger().getInternalLogger().addAppender(browserConsoleAppender);
						this.setLogLevel(this.loggerState.browserConsoleAppender.threshold);
					}
				}
				//#endregion
			}
			else {
				//#region Browser
				let ajaxAppender = appenders.find((a) => a.toString() === "Ionic.Logging.AjaxAppender") as AjaxAppender;
				if (ajaxAppender) {
					// add appender
					ajaxAppender = new AjaxAppender({
						batchSize: this.loggerState.ajaxAppender.batchSize,
						threshold: this.loggerState.ajaxAppender.threshold,
						url: this.loggerState.ajaxAppender.url,
						timerInterval: this.loggerState.ajaxAppender.timerInterval

					});
					this.loggingService.getRootLogger().getInternalLogger().addAppender(ajaxAppender);
					this.setLogLevel(this.loggerState.ajaxAppender.threshold)
				}
				else {
					const browserConsoleAppender = appenders.find((a) => a.toString() === "BrowserConsoleAppender") as BrowserConsoleAppender;
					if (browserConsoleAppender) {
						this.loggingService.getRootLogger().getInternalLogger().addAppender(browserConsoleAppender);
						this.setLogLevel(this.loggerState.browserConsoleAppender.threshold);
					}
				}
				//#endregion
			}
			return true
		}
		catch (error) {
			console.log(methodName, [error]);
			return false
		}

	}
 */