import { Component, OnInit } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

import { Logger, LoggingService } from "ionic-logging-service";

import { LoggingViewerTranslation } from "./logging-viewer-translation.model";

/**
 * Ionic modal containing the LoggingViewerComponent.
 */
@Component({
	template:
	"<ion-header>" +
	"<ion-toolbar color=\"primary\">" +
	"<ion-title>{{ getTranslation().title }}</ion-title>" +
	"<ion-buttons start>" +
	"<button ion-button hideWhen=\"android,windows\" (click)=\"onClose()\" >" +
	"{{ getTranslation().cancel }}" +
	"</button>" +
	"<button ion-button icon-only showWhen=\"android,windows\" (click)=\"onClose()\" >" +
	"<ion-icon name=\"md-close\"></ion-icon>" +
	"</button>" +
	"</ion-buttons>" +
	"</ion-toolbar>" +
	"<ion-toolbar>" +
	"<ionic-logging-viewer-search [placeholder]=\"getTranslation().searchPlaceholder\"></ionic-logging-viewer-search>" +
	"</ion-toolbar>" +
	"<ion-toolbar>" +
	"<ionic-logging-viewer-levels></ionic-logging-viewer-levels>" +
	"</ion-toolbar>" +
	"</ion-header>" +
	"<ion-content>" +
	"<ionic-logging-viewer></ionic-logging-viewer>" +
	"</ion-content>",
})
export class LoggingViewerModalComponent implements OnInit {

	/**
	 * Language to be used for the modal.
	 * Currently supported: en, de
	 */
	public language: string;

	/**
	 * Translation to be used for the modal.
	 * If specified, the language is ignored.
	 */
	public translation: LoggingViewerTranslation;

	// tslint:disable-next-line:completed-docs
	private logger: Logger;

	// tslint:disable-next-line:completed-docs
	private translations: { [language: string]: LoggingViewerTranslation; };

	constructor(
		private viewController: ViewController,
		navParams: NavParams,
		loggingService: LoggingService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Modal.Component");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.language = navParams.get("language");
		this.translation = navParams.get("translation");

		this.logger.exit(methodName);
	}

	/**
	 * Initializes the LoggingViewerModalComponent.
	 * It configures the supported translations.
	 */
	public ngOnInit(): void {
		// prepare translations
		this.translations = {};
		// tslint:disable-next-line:no-string-literal
		this.translations["en"] = {
			cancel: "Cancel",
			searchPlaceholder: "Search",
			title: "Logging",
		};
		// tslint:disable-next-line:no-string-literal
		this.translations["de"] = {
			cancel: "Abbrechen",
			searchPlaceholder: "Suchen",
			title: "Konfiguration",
		};
	}

	/**
	 * Eventhandler called by Ionic when the modal is opened.
	 */
	public ionViewDidEnter(): void {
		const methodName = "ionViewDidEnter";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}

	/**
	 * Eventhandler called when the cancel button is clicked.
	 */
	public onClose(): void {
		const methodName = "onClose";
		this.logger.entry(methodName);

		this.viewController.dismiss();

		this.logger.exit(methodName);
	}

	/**
	 * Helper method returning the current translation:
	 * - the property translation if defined
	 * - the translation according property language if valid
	 * - English translation, otherwise
	 */
	public getTranslation(): LoggingViewerTranslation {
		if (typeof this.translation !== "undefined") {
			return this.translation;
		} else if (typeof this.language !== "undefined" && typeof this.translations[this.language] === "object") {
			return this.translations[this.language];
		} else {
			// tslint:disable-next-line:no-string-literal
			return this.translations["en"];
		}
	}
}
