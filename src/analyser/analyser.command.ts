import { Analiser, ClientSettings } from "libs/papyrus-brainiac";
import { StructuralAnalysisModal } from "./analyser.modal";
import { LoadingModal } from "src/modals/loading.modal";
import { App, MarkdownView } from "obsidian";

export interface StructuralAnalysisSettings extends ClientSettings{
}

export class AnalysisCommand {
    private analiser: Analiser
    private app: App

    constructor(app: App, setting: StructuralAnalysisSettings) {
        this.app = app;
        this.analiser = new Analiser(setting);
    }

    async execute(): Promise<void> {
		const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
        if (markdownView?.editor) {
            new LoadingModal(
                this.app,
                async () => await this.analiser.getSuggestionPoints(markdownView?.editor.getValue()),
                (suggestions: Array<string>) => new StructuralAnalysisModal(this.app, suggestions).open())
            .open();
        }
    }
}