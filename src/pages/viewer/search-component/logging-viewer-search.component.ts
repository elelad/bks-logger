import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerFilterService } from "../logging-viewer-filter.service";
/**
 * Component for displaying the search bar for filtering the current logs.
 * The component can be embedded in any web page using the directive ionic-logging-viewer-search.
 */
@Component({
	selector: "ionic-logging-viewer-search",
	templateUrl: "logging-viewer-search.component.html" 
})
export class LoggingViewerSearchComponent implements OnInit, OnDestroy {

	@Input()
	public placeholder: string;
	public search: string;

	private logger: Logger;
	private filterChangedSubscription: Subscription;

	constructor(
		loggingService: LoggingService,
		private loggingViewerFilterService: LoggingViewerFilterService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Search.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		if (!this.placeholder) {
			this.placeholder = "Search";
		}
		this.search = this.loggingViewerFilterService.search;

		this.logger.exit(methodName);
	}

	public ngOnInit(): void {
		const methodName = "ngOnInit";
		this.logger.entry(methodName);

		// subscribe to loggingViewerFilterService.filterChanged event, to refresh,
		// when someone else modifies the search value
		this.filterChangedSubscription = this.loggingViewerFilterService.filterChanged.subscribe(() => {
			this.search = this.loggingViewerFilterService.search;
		});

		this.logger.exit(methodName);
	}

	public ngOnDestroy(): void {
		const methodName = "ngOnDestroy";
		this.logger.entry(methodName);

		this.filterChangedSubscription.unsubscribe();

		this.logger.exit(methodName);
	}

	public onSearchChanged(): void {
		const methodName = "onSearchChanged";
		this.logger.entry(methodName);

		this.loggingViewerFilterService.search = this.search;

		this.logger.exit(methodName);
	}
}
