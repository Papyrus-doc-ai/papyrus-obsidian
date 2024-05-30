import {App, MarkdownView} from "obsidian";
import {ClientSettings, FormatImporter} from "libs/papyrus-brainiac";
import { FormatPickerModal } from "./importer.modal";

export interface FormatImporterSettings extends ClientSettings {
}

export class FormatImporterCommand {
	private app: App;
	private formatImporter: FormatImporter;

	constructor(app: App, setting: FormatImporterSettings) {
		this.app = app;
		this.formatImporter = new FormatImporter(setting);
	}

	async execute(): Promise<void> {
		const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
        if (markdownView?.editor) {
			new FormatPickerModal(this.app, this.formatImporter, markdownView?.editor.getValue()).open();
		}
	}
}
