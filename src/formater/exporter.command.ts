import { ClientSettings, FormatExporter } from "libs/papyrus-brainiac";
import { App, Component, MarkdownView } from "obsidian";
import { LoadingModal } from "src/modals/loading.modal";
import { FormatExporterModal } from "./exporter.modal";

export interface FormatExporterSettings extends ClientSettings {
}

export class FormatExporterCommand {
	private app: App;
	private formatExporter: FormatExporter;
	private component: Component;

	constructor(app: App, setting: FormatExporterSettings, component: Component) {
		this.app = app;
		this.formatExporter = new FormatExporter(setting);
		this.component = component;
	}

	async execute(): Promise<void> {
		const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
		if (markdownView?.editor) {
			new LoadingModal(
				this.app,
				async () => await this.formatExporter.export(markdownView?.editor.getValue()),
				(exportedTemplate: string) => new FormatExporterModal(
					this.app,
					exportedTemplate,
					this.component).open())
				.open();


		}
	}
}
