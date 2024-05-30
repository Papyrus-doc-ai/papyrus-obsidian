import { ClientSettings, Taskifier } from "libs/papyrus-brainiac";
import { App, Editor, MarkdownView } from "obsidian";
import { LoadingModal } from "src/modals/loading.modal";
import { TaskifierTextModal } from "./taskifier.modal";
import { Task } from "./task";
import { getEndOfEditor } from "src/utils/editor.util";

export interface TaskifierSettings extends ClientSettings {
}

export class TaskifierCommand {
    private app: App;
    private taskifier: Taskifier
    private editor: Editor;

    constructor(app: App, setting: TaskifierSettings) {
        this.app = app;
        this.taskifier = new Taskifier(setting);
    }

    async execute(): Promise<void> 
    {
        const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
        if (markdownView?.editor) {
            this.editor = markdownView?.editor;
            const document : string = this.editor.getValue();
            const loadingModal = new LoadingModal(
                this.app,
                async () => await this.taskifier.getTasks(document),
                (tasks: object[]) => new TaskifierTextModal(
                    this.app,
                    tasks.map((value: object) => Task.fromJSON(value)),
                    this.submitTasks,
                    async () => await this.execute()).open());

            loadingModal.open();
        }
    }

    async submitTasks(new_document: string | null) : Promise<void>   {
        if (new_document == null){
            this.editor.replaceRange(
                "\n" + new_document, 
                getEndOfEditor(this.editor)
            );
        }
    } 
}