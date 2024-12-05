import { ClientSettings, Generator } from "libs/papyrus-brainiac";
import { App, Editor, ItemView, MarkdownView, Setting, TFile, ViewStateResult, WorkspaceLeaf } from "obsidian";
import { MarkdownComparator } from "../utils/markdown-comparator.util";
import { LoadingModal} from "../modals/loading.modal";
import { convertMarkdownToHTML } from "src/utils/html.utils";
import { getRightLeaf } from "../utils/leaf.utils";


export const VIEW_TYPE_GENERATOR = "generator-view";

export interface GeneratorViewSettings extends ClientSettings{
}

export class GeneratorView extends ItemView {
    private currentQuestion: number = 0;
    private suggestions: string[];
    private generator: Generator;
    private setting?: Setting
    private markdownComparator: MarkdownComparator|undefined = undefined;

    constructor(leaf: WorkspaceLeaf, setting: GeneratorViewSettings) {
        super(leaf);
        this.generator = new Generator(setting);
    }

    getViewType() {
        return VIEW_TYPE_GENERATOR;
    }

    getDisplayText() {
        return "Papyrus generator";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        const chat_container = container.createDiv({ cls: "generator-container" });
        chat_container.createEl('h1', {text: "Loading"})
    }

    async onClose() {
        // Nothing to clean up.
    }

    async setState(state: any, result: ViewStateResult): Promise<void> {
        this.suggestions = state.suggestions;
        if (this.suggestions) {
            this.currentQuestion = 0;
        
            await this.getQuestion();
        }

        super.setState(state, result);
    }

    private async getQuestion(reSubmit: boolean = false) {
        if (this.currentQuestion < this.suggestions.length) {
            await this.generator.getQuestionForSuggestion(
                this.getDocument(), 
                this.suggestions[this.currentQuestion])
                .then((question: string) => {
                    this.createGeneratorContainer(this.suggestions[this.currentQuestion], question, reSubmit);
                });
        } else {
            this.createEndContainer()
        }
    }

    private createGeneratorContainer(suggestion: string, question: string, reSubmit: boolean = false) {
        this.clearSetting();
        const container = this.containerEl.children[1];

        if (reSubmit) {
            this.containerEl.children[2].remove();
        }
        
        container.empty();
        const chat_container = container.createDiv({ cls: "generator-container" });
        if (this.currentQuestion < this.suggestions.length) {
            chat_container.createEl('h4', {text: suggestion});
            chat_container.createDiv().insertAdjacentHTML("afterbegin", convertMarkdownToHTML(question));
            const input_section = chat_container.createDiv();
            const textarea = input_section.createEl("textarea", { cls: "middle-textarea", attr: { placeholder: "Help us help you...", rows: 5} });
            textarea.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter'  && !e.shiftKey) {
                    // Prevent the default action to avoid submitting the form
                    e.preventDefault();
                    if (textarea.value == "") {
                        return;
                    }
                    new LoadingModal(
                        this.app,
                        async () => {
                            return await this.generator.updateDocumentWithAnswer(
                                this.getDocument(),
                                this.suggestions[this.currentQuestion],
                                textarea.value
                            );
                        },
                        (updatedDocument) => {
                            this.createDocumentContainer(updatedDocument);
                        }
                    ).open();
                }
            });
            this.setting = new Setting(this.containerEl)
                .addButton(
                    btn => btn
                        .setButtonText("Regenerate")
                        .onClick(() => {
                            new LoadingModal(
                                this.app,
                                async () => {
                                    this.cancelMarkdownComparator();
                                    await this.getQuestion(true)
                                },
                                () => {}
                            ).open();
                        })
                )
                .addButton(
                    btn => btn
                        .setButtonText("Next question")
                        .onClick(() => {
                            new LoadingModal(
                                this.app,
                                async () => {
                                    this.currentQuestion++;
                                    if (this.markdownComparator != undefined) {
                                        this.cancelMarkdownComparator();
                                        await this.getQuestion(true);
                                    } else {
                                        await this.getQuestion(false);
                                    }
                                },
                                () => {}
                            ).open();
                        })
                )
                .addButton(
                    btn => btn
                        .setButtonText("Submit")
                        .setCta()
                        .onClick(() => {
                            if (textarea.value == "") {
                                return;
                            }

                            new LoadingModal(
                                this.app,
                                async () => {
                                    return await this.generator.updateDocumentWithAnswer(
                                        this.getDocument(),
                                        this.suggestions[this.currentQuestion],
                                        textarea.value
                                    );
                                },
                                (updatedDocument) => {
                                    this.createDocumentContainer(updatedDocument);
                                }
                            ).open();
                        })
                );
        } else {
            this.createEndContainer(); 
        }
    }

    private createEndContainer() {
        this.clearSetting();

        const container = this.containerEl.children[1];
        this.containerEl.children[2].remove();
        container.empty();
        const chat_container = container.createDiv({ cls: "generator-container" });
        const section = chat_container.createDiv();
        section.createEl('h1', {text: "There's nothing I can help you with! You've done it!"});
        
        this.setting = new Setting(this.containerEl)
            .addButton(
                btn => btn
                    .setButtonText("Close")
                    .setCta()
                    .onClick(() => {
                        this.leaf.detach();
                    })
            ); 
    }

    private createDocumentContainer(updatedDocument: string) {
        const isResubmit: boolean = this.markdownComparator != undefined;
        this.openNewDocument(updatedDocument)
        if (isResubmit) {
            return;
        }

        this.setting = new Setting(this.containerEl)
            .addButton(
                btn => btn
                    .setButtonText("Use this version")
                    .setCta()
                    .onClick(() => {
                        new LoadingModal(
                            this.app,
                            async () => {
                                this.confirmMarkdownComparator();
                                this.currentQuestion++;
                                await this.getQuestion(true);
                            },
                            () => {}
                        ).open();
                    })
            );
    }

    private openNewDocument(updatedDocument: string) {
        if (this.markdownComparator == undefined) {
            this.markdownComparator = new MarkdownComparator(
                this.app, 
                this.getFile(), 
                updatedDocument, 
                "structure-analysis.md");
            this.markdownComparator.getShitDone(false);
        } else {
            this.markdownComparator.updateTemporaryFileData(updatedDocument);
        }
    }

    private cancelMarkdownComparator() {
        if (this.markdownComparator) {
            this.markdownComparator.cancelCallback();
            this.markdownComparator = undefined;
        }
    }

    private confirmMarkdownComparator() {
        if (this.markdownComparator) {
            this.markdownComparator.confirmCallback();
            this.markdownComparator = undefined;
        }
    }

    private getDocument(): string {
        return this.getEditor().getValue();
    }

    private getEditor(): Editor {
        const mardownView = this.app.workspace.getLeaf().view as MarkdownView;
        return mardownView.editor;
    }

    private getFile(): TFile {
        return (this.app.workspace.getLeaf().view as MarkdownView).file!;
    }

    private clearSetting() {
        if (this.setting) {
            console.log(this.setting);
            this.setting.settingEl.remove();
        }
    }
}

export async function activateGeneratorView(app: App, suggestions: string[]) {
    await getRightLeaf(app, VIEW_TYPE_GENERATOR, {suggestions: suggestions}, false);
}
