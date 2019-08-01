import { EventEmitter, Injectable } from "@angular/core";
import { ModalController } from "ionic-angular";

import { LoggingViewerModalComponent } from "./logging-viewer-modal.component";
import { LoggingViewerTranslation } from "./logging-viewer-translation.model";

import { Logger, LoggingService } from "ionic-logging-service";

/**
 * Helper class which makes the usage of the LoggingViewerModalComponent more comfortable.
 */
@Injectable()
export class LoggingViewerModalManager {

	/**
	 * Event submitted when the modal gets closed.
	 */
	public modalClosed = new EventEmitter<void>();

	// tslint:disable-next-line:completed-docs
	private logger: Logger;

	constructor(
		private modalController: ModalController,
		loggingService: LoggingService) {

		this.logger = loggingService.getLogger("Ionic.Logging.Viewer.Modal.Manager");
		const methodName = "ctor";
		this.logger.entry(methodName);

		this.logger.exit(methodName);
	}

	/**
	 * Opens the modal.
	 * @returns Promise which gets resolved as soon as the modal is shown.
	 */
	public openModal(language?: string, translation?: LoggingViewerTranslation): Promise<void> {
		const methodName = "openModal";
		this.logger.entry(methodName);

		const modal = this.modalController.create(LoggingViewerModalComponent, {
			language,
			translation,
		});
		modal.onDidDismiss(() => {
			this.onModalClosed();
		});
		const promise = modal.present();

		this.logger.exit(methodName);
		return promise;
	}

	/**
	 * Callback called when the modal is closed.
	 */
	private onModalClosed(): void {
		const methodName = "onModalClosed";
		this.logger.entry(methodName);

		this.modalClosed.emit();

		this.logger.exit(methodName);
	}
}
