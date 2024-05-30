import { App, Modal, Setting } from "obsidian";
import { LoadingModal } from "../modals/loading.modal";
import { CheckboxModal } from "../modals/check-box.modal";
import { activateGeneratorView } from "./analyser.view";


export class StructuralAnalysisModal extends Modal {
	checkBoxModal: CheckboxModal

	constructor(app: App, bulletPoints: Array<string>) {
		super(app);
		this.checkBoxModal = new CheckboxModal(bulletPoints, "Select the suggestions you want to improve. I will help you.");
	}

	onOpen(): void {
		const { contentEl } = this;
		this.checkBoxModal.instantiate(contentEl);

    	new Setting(contentEl).addButton(
			btn => btn
				.setButtonText("Analyse")
				.setCta()
				.onClick(() => {
					const checkedPoints = this.checkBoxModal.getCheckedPoints();
					if (checkedPoints.length != 0) {
						new LoadingModal(
							this.app,
							async () => await activateGeneratorView(this.app, checkedPoints),
							() => {}).open();
					}
          			this.close();
				}));
	}

	onClose(): void {
		const { contentEl } = this;
		this.checkBoxModal.destroy();
		contentEl.empty();
	}
}
