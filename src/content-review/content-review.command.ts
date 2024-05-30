import { App } from "obsidian";
import { LoadingModal } from "src/modals/loading.modal";
import { activateTechReviewView } from "./content-review.view";

export class ContentReviewCommand {
	private app: App;

	constructor(app: App) {
		this.app = app;	
    }

	async execute(): Promise<void> {
        new LoadingModal(
            this.app,
            async () => await activateTechReviewView(this.app),
            () => {})
          .open();
	}
}