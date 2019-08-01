import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";

/**
 * Component for displaying the log levels for filtering the current logs.
 * The component can be embedded in any web page using the directive ionic-logging-viewer-levels.
 */
@Component({
	selector: "ionic-logging-viewer-levels",
	templateUrl: "logging-viewer-levels.component.html"
	
})
export class LoggingViewerLevelsComponent implements OnInit, OnDestroy {

	public logLevels: string[];
	public selectedLevel: string;

	private logger: Logger;
	private filterChangedSubscription: Subscription;

	constructor(
		loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Levels.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logLevels = [];
		this.logLevels.push(
			"DEBUG",
			"INFO",
			"WARN",
			"ERROR",
		);
		this.selectedLevel = loggingViewerFilterService.level;

		this.logger.exit(methodName);
	}

	public ngOnInit(): void {
		const methodName = "ngOnInit";
		this.logger.entry(methodName);

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh,
		// when someone else modifies the level
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.selectedLevel = this.loggingViewerFilterService.level;
		});

		this.logger.exit(methodName);
	}

	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		this.filterChangedSubscription.unsubscribe();

		this.logger.exit(methodName);
	}

	public onLevelChanged(): void {
		const methodName = "onLevelChanged";
		this.logger.entry(methodName, this.selectedLevel);

		this.loggingViewerFilterService.level = this.selectedLevel;

		this.logger.exit(methodName);
	}
}
