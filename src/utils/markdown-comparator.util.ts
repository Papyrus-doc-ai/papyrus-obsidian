import { App, ItemView, TFile, WorkspaceLeaf, ViewStateResult } from "obsidian";
import { getRightLeaf } from "src/utils/leaf.utils";
import { getOrCreateFile } from "./files.utils";

export const VIEW_TYPE_MARKDOWN_COMPARATOR = "markdown-comparator-confirm-view";

export class MarkdownComparator {
    private app: App;
    private originalFile: TFile;
    private newMarkdown: string;
    private temporaryFilePath: string;
    private splitLeaf: WorkspaceLeaf|undefined = undefined;

    constructor(app: App, originalFile: TFile, newMarkdown: string, temporaryFilePath: string = "tmp.md") {
        this.app = app;
        this.originalFile = originalFile;
        this.newMarkdown = newMarkdown;
        this.temporaryFilePath = temporaryFilePath;
    }

    async getShitDone(createConfirmActionView = true) {
        const temporaryFile: TFile = await this.fetchTemporaryFile();
        await this.app.vault.modify(temporaryFile, this.newMarkdown);
        this.splitLeaf = this.app.workspace.createLeafBySplit(
            this.app.workspace.getLeaf(false), 
            'vertical');
        this.splitLeaf.openFile(temporaryFile);
        
        if (createConfirmActionView) {
            await this.createConfirmView(temporaryFile);
        }
    }

    async updateTemporaryFileData(newDocument: string): Promise<void> {
        const temporaryFile: TFile = await this.fetchTemporaryFile();
        await this.app.vault.modify(temporaryFile, newDocument);
    }

    async confirmCallback() {
        this.closeSplit();
        const temporaryFile: TFile = await this.fetchTemporaryFile();
        const newText: string = await this.app.vault.read(temporaryFile);
        await this.app.vault.modify(this.originalFile, newText);
        await this.app.vault.delete(temporaryFile);
    }

    async cancelCallback() {
        this.closeSplit();
        const temporaryFile: TFile = await this.fetchTemporaryFile();
        await this.app.vault.delete(temporaryFile);
    }

    closeSplit() {
        if (this.splitLeaf) {
            this.splitLeaf.detach();
            this.splitLeaf = undefined;
        }
    }

    async fetchTemporaryFile(): Promise<TFile> {
        return await getOrCreateFile(this.temporaryFilePath, this.app)
    }

    private async createConfirmView(temporaryFile: TFile): Promise<void> {
        await getRightLeaf(
            this.app, 
            VIEW_TYPE_MARKDOWN_COMPARATOR, 
            { 
                callback: async (evt: MouseEvent) => {
                    await this.confirmCallback();
                },
                cancelCallback: async (evt: MouseEvent) => {
                    await this.cancelCallback();
                }
            }, 
            false);
    }
}

export class MarkdownComparatorConfirmView extends ItemView {
    private callback: (evt: MouseEvent) => Promise<void>;
    private cancelCallback: (evt: MouseEvent) => Promise<void>;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE_MARKDOWN_COMPARATOR;
    }

    getDisplayText(): string {
        return "Papyrus markdown comparator confirmator";
    }

    getIcon(): string {
        return "book";
    }

    async onOpen() {        
        const container = this.containerEl.children[1];

        const containerDivs = container.createDiv({ cls: "dj-button-div" });

        const confirmButtonContainer = containerDivs.createDiv({ cls: "dj-button-container" });
        const cancelButtonContainer = containerDivs.createDiv({ cls: "dj-button-container" });

        confirmButtonContainer
            .createEl("button", { cls: "mod-cta dj-button button-grammar-corrector-confirm", text: "Hit it DJ"})
            .onClickEvent(
                (evt: MouseEvent) => {
                    this.callback.call(evt);
                    this.leaf.detach();
                }
            );  
        
        cancelButtonContainer
            .createEl("button", { cls: "dj-button button-grammar-corrector-cancel", text: "Get out"})
            .onClickEvent(
                (evt: MouseEvent) => {
                    this.cancelCallback.call(evt);
                    this.leaf.detach();
                }
            );  
    }

    async onClose() {
        // Nothing to clean up
    }

    async setState(state: any, result: ViewStateResult): Promise<void> {
        super.setState(state, result);

        this.setCallback(state.callback);
        this.setCancelCallback(state.cancelCallback);
    }

    setCallback(newCallback: (evt: MouseEvent) => Promise<void>): void {
        this.callback = newCallback;
    }

    setCancelCallback(newCallback: (evt: MouseEvent) => Promise<void>): void {
        this.cancelCallback = newCallback;
    }
}
