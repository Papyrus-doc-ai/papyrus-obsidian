import { App } from "obsidian";
import { PersonaChatModal } from "./persona-selector.modal";

export class PersonaChatCommand {
	private app: App;

	constructor(app: App) {
		this.app = app;	
    }

	async execute(): Promise<void> {
		new PersonaChatModal(this.app).open()
	}
}