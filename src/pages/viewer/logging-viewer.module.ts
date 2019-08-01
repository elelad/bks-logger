import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";

import { LoggingViewerFilterService } from "./logging-viewer-filter.service";
import { LoggingViewerLevelsComponent } from "./levels-component/logging-viewer-levels.component";
import { LoggingViewerModalComponent } from "./logging-viewer-modal.component";
import { LoggingViewerModalManager } from "./logging-viewer-modal.manager";
import { LoggingViewerSearchComponent } from "./search-component/logging-viewer-search.component";
import { LoggingViewerComponent } from "./viewr-component/logging-viewer.component";

/**
 * LoggingViewerModule is an NgModule that provides a viewer component showing the logs
 * currently written the LoggingService.
 *
 * The module is meant for use at development and test, not for production.
 *
 * The module contains mainly
 * - LoggingViewerComponent: directive showing the data, which can placed anywhere in your app
 * - LoggingViewerModalManager: provides method to open a modal containing the component
 *
 * Additionally, there are two components for filtering the data:
 * - LoggingViewerLevelComponent: allows filtering by log level
 * - LoggingViewerSearchComponent: allows filtering by an arbitrary expression
 */
@NgModule({
	declarations: [
		LoggingViewerModalComponent,
		LoggingViewerComponent,
		LoggingViewerLevelsComponent,
		LoggingViewerSearchComponent,
	],
	entryComponents: [
		LoggingViewerModalComponent,
	],
	exports: [
		LoggingViewerComponent,
		LoggingViewerLevelsComponent,
		LoggingViewerModalComponent,
		LoggingViewerSearchComponent,
	],
	imports: [
		IonicModule,
	],
	providers: [
		LoggingViewerFilterService,
		LoggingViewerModalManager,
	],
})
export class LoggingViewerModule { }
