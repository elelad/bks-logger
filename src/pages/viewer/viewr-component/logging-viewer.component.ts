import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Logger, LoggingService, LogLevelConverter, LogMessage } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

/**
 * Component for displaying the current logs.
 * The component can be embedded in any web page using the directive ionic-logging-viewer.
 */
@Component({
	selector: "ionic-logging-viewer",
	templateUrl: "logging-viewer.component.html"
	
})
export class LoggingViewerComponent implements OnInit, OnDestroy {

	public logMessagesForDisplay: LogMessage[];

	private logger: Logger;
	@Input() logMessages: LogMessage[];
	private logMessagesChangedSubscription: Subscription;
	private filterChangedSubscription: Subscription;

	constructor(
		private loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}

	public ngOnInit(): void {
		const methodName = "ngOnInit";
		this.logger.entry(methodName);

		//this.logMessages = this.loggingService.getLogMessages();
		//this.logMessages = this.fromFileMsgs
		this.filterLogMessages();

		// subscribe to loggingService.logMessagesChanged event, to refresh, when new message is logged
		this.logMessagesChangedSubscription = this.loggingService.logMessagesChanged.subscribe(() => {
			this.logMessages = this.loggingService.getLogMessages();
			this.filterLogMessages();
		});

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh, when filter is modified
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.filterLogMessages();
		});

		this.logger.exit(methodName);
	}

	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		this.logMessagesChangedSubscription.unsubscribe();
		this.filterChangedSubscription.unsubscribe();

		this.logger.exit(methodName);
	}

	public filterLogMessages(): void {
		this.logMessagesForDisplay = this.logMessages.filter((message) => {
			return this.filterLogMessagesByLevel(message) && this.filterLogMessagesBySearch(message);
		});
	}

	public filterLogMessagesByLevel(message: LogMessage): boolean {
		const levelValue = this.loggingViewerFilterService.level;
		return LogLevelConverter.levelFromString(message.level) >= LogLevelConverter.levelFromString(levelValue);
	}

	public filterLogMessagesBySearch(message: LogMessage): boolean {
		const searchValue = new RegExp(this.loggingViewerFilterService.search, "i");
		return message.logger.search(searchValue) >= 0 ||
			message.methodName.search(searchValue) >= 0 ||
			message.message.join("|").search(searchValue) >= 0;
	}
}
