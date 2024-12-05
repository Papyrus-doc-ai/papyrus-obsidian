import { App, Component, MarkdownRenderer, Modal, Setting } from "obsidian";
import { Task } from "./task";


export class TaskifierTextModal extends Modal {
	onSubmit: (new_document: string | null) => void
	tasks: Task[]
	generateAgain: () => Promise<void>
	private component: Component;

	constructor(
		app: App,
		tasks: Task[],
		onSubmit: (new_document: (string | null)) => void,
		generateAgain: () => Promise<void>,
		component: Component) {
		super(app);
		this.onSubmit = onSubmit;
		this.tasks = tasks;
		this.generateAgain = generateAgain;
		this.component = component;
	}

	async onOpen(): Promise<void> {

		const { contentEl } = this;
		const taskListRender = contentEl.createDiv({ cls: "taskListRender-markdown-editor" }).createDiv({ cls: "cm-content" });
		taskListRender.dataset["language"] = "hypermd";
		MarkdownRenderer.render(this.app, this.tasks.map((value: Task) => value.toPrettyMarkdownString()).join("\n"), taskListRender, "./", this.component);

		const setting = new Setting(contentEl);

		setting.addButton(
			btn => btn
				.setButtonText("Generate again")
				.onClick(async () => {
					this.close();
					await this.generateAgain();
				})
		);

		setting.addButton(
			btn => btn
				.setButtonText("Close and add tasks to document")
				.setCta()
				.onClick(() => {
					let tasksToAppend = "";
					tasksToAppend += "# Tasks \n \n";
					tasksToAppend += this.tasks.map((value: Task) => value.extractMainInfo()).join("\n");

					this.onSubmit(tasksToAppend);
					this.close();
				})
		);



	}
	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

}
