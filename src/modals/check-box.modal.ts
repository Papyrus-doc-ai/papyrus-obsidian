import { CheckBoxElement } from '../utils/html.utils';

interface BuildingBlockModal {
    container: HTMLElement;
    instantiate(parent: HTMLElement): void;
    destroy(): void
}


export class CheckboxModal implements BuildingBlockModal {
	checkBoxElements: Array<CheckBoxElement>;
	points: Array<string>;
    title: string|undefined = undefined;
    container: HTMLElement;

	constructor(points: Array<string>, title: string|undefined = undefined) {
		this.points = points;
        this.title = title;
		this.checkBoxElements = [];
	}

	instantiate(contentEl: HTMLElement): void {
        if (this.title) {
            const header = contentEl.createDiv();
            header.createEl('h3', {text: this.title});
            header.createEl('hr');
        }
		this.container = contentEl.createDiv();
		for(var point of this.points) {
			this.checkBoxElements.push(new CheckBoxElement(
				point, 
				this.container, 
				{ cls: "check-point-modal-container" }, 
				{ cls: "check-point-modal-text" }));
		}
	}

	getCheckedPoints(): Array<string> {
		return this.checkBoxElements
			.filter((value: CheckBoxElement) => value.isChecked())
			.map((value: CheckBoxElement) => value.text);
	}

	destroy(): void {
		this.container.empty();
	}
}