import { App, Component, MarkdownRenderer, Modal, TFile, TFolder } from "obsidian";

export class FormatExporterModal extends Modal {
	template: string;
	private component: Component;

	constructor(app: App, exportedDocument: string, component: Component) {
		super(app);
		this.template = exportedDocument;
		this.component = component;
	}

	async onOpen(): Promise<void> {

		const { contentEl } = this;
		const taskListRender = contentEl.createDiv({ cls: "formatTemplateRender" }).createDiv({ cls: "cm-content" });
		taskListRender.dataset["language"] = "hypermd";
		MarkdownRenderer.render(this.app, this.template, taskListRender, "./", this.component);

		contentEl.createDiv({ cls: "bottom-right-shit" });
		const inputEl = contentEl.createEl('input');
		inputEl.type = 'text';
		inputEl.placeholder = 'Choose filename';

		inputEl.addEventListener('keydown', async (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				const userInput = (event.target as HTMLInputElement).value;
				console.log('User input:', userInput);
				await this.createFile(userInput + ".md", "templates", this.template);
				this.close();
			}
		});

	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	async createFolderIfNotExists(folderPath: string): Promise<TFolder | null> {
		let folder = this.app.vault.getAbstractFileByPath(folderPath);
		if (folder && folder instanceof TFolder) {
			return folder;
		} else {
			return await this.app.vault.createFolder(folderPath);
		}
	}

	async createFile(fileName: string, folderPath: string, content: string) {
		await this.createFolderIfNotExists(folderPath);

		const newFile: TFile = await this.app.vault.create(folderPath + '/' + fileName, content);
		if (newFile) {
			console.log(`File created: ${newFile.name}`);
		} else {
			console.error(`Failed to create file: ${folderPath}/${fileName}`);
		}
	}
}
