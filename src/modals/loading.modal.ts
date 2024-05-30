import { App, Modal, Setting } from "obsidian";

export class LoadingModal<T> extends Modal {

	action: () => Promise<T>
	resolve: (response: T) => void
	canceled: boolean = false

	constructor(app: App, action: () => Promise<T>, resolve: (response: T) => void) {
		super(app);
		this.action = action;
		this.resolve = resolve;
	}

	onOpen(): void {
		const { contentEl } = this;

		let loaderContainer = contentEl
			.createDiv({cls: "loader-container"});

		loaderContainer
			.createDiv({cls: "loader"})

		loaderContainer
			.createDiv({cls: "loader-text", text: "Generating..."});

		try {
			this.action()
				.then((response: T) => {
					if (!this.canceled) {
						this.resolve(response);
					}
					this.close();
				}).catch((reason: any) => this.processError(reason, contentEl));
		}
		catch (error) {
			this.processError(error, contentEl);
		}
	}

	onClose(): void {
		const { contentEl } = this;
		this.canceled = true;
		contentEl.empty();
	}

	private processError(error: any, contentEl: HTMLElement): void {
		contentEl.empty()
		console.error("Error loading:", error);

		contentEl.createDiv().createEl("h2", { text: "There was an error"});
		const buttons:HTMLElement = contentEl.createDiv({cls: "error-loading-buttons-container"}); 

		new Setting(buttons.createDiv()).addButton(
			btn => btn
				.setButtonText("Try again")
				.setCta()
				.onClick(() => {
					this.close();
					this.open();
				}));

		new Setting(buttons.createDiv()).addButton(
			btn => btn
				.setButtonText("Cancel")
				.setCta()
				.onClick(() => {
					this.close();
				}));
	}
}



