import { ClientSettings, GrammarFixer } from "libs/papyrus-brainiac";
import { App, MarkdownView, TFile} from "obsidian";
import { MarkdownComparator } from "../utils/markdown-comparator.util";
import { LoadingModal } from "src/modals/loading.modal";


export interface GrammarCorrectorSettings extends ClientSettings {
}

export class GrammarCorrectorCommand {
	private grammarFixer : GrammarFixer;
    private app : App;

    constructor(app: App, setting: GrammarCorrectorSettings) {
        this.app = app;
        this.grammarFixer = new GrammarFixer(setting);
    }

    async execute() {  
        const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
        if (markdownView?.editor) {
            new LoadingModal(
                this.app, 
                async () => await this.grammarFixer.improveGrammar(markdownView?.editor.getValue()),
                (improvedDocument: string) => this.openComparator(this.app, improvedDocument)
            ).open();
        }
    }

    async openComparator(app : App, improvedDocument : string) {
        const originalFileTrying: TFile | null | undefined = app.workspace.getActiveViewOfType(MarkdownView)?.file;
        
        if (originalFileTrying == null || originalFileTrying == undefined) {
            console.error("File not open");
            return;
        }
        
        const originalFile: TFile = originalFileTrying!;

        await new MarkdownComparator(
            app, 
            originalFile, 
            improvedDocument, 
            "grammar-correction.md")
            .getShitDone();
    }
}