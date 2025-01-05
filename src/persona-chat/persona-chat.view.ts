import { ItemView, Component, MarkdownRenderer, MarkdownView, ViewStateResult, WorkspaceLeaf } from "obsidian";
import { ClientSettings, FeedBackPersonaBot } from "libs/papyrus-brainiac";


export const VIEW_TYPE_PERSONA_CHAT = "persona-chat-view";

export interface PersonaChatViewSettings extends ClientSettings {
}

class ChatMessage {
	public message: string;
	public isUser: boolean;

	constructor(message: string, isUser: boolean) {
		this.message = message;
		this.isUser = isUser;
	}
}

export class PersonaChatView extends ItemView {

	private settings: PersonaChatViewSettings;
	private chatBot: FeedBackPersonaBot;
	private title: string;

    private conversationEl: HTMLDivElement;
	private component: Component;


    constructor(leaf: WorkspaceLeaf, settings: PersonaChatViewSettings, component: Component) {
        super(leaf);
        this.settings = settings;
		this.component = component;
    }
  
    getViewType() {
    	return VIEW_TYPE_PERSONA_CHAT;
    }
  
    getDisplayText() {
    	return "CoPapyrus tech review";
    }
  
    getIcon() {
      	return "message-circle";
    }
  
    async onOpen() {

	}

	async loadChat() {
		const container = this.containerEl.children[1];
		container.empty();

		const personaChatContainer = container.createDiv({ cls: "chat-container" });
		const titleDiv = personaChatContainer.createDiv({ cls: "chat-title" });
		titleDiv.createEl('h1', { text: this.title });

		this.conversationEl = personaChatContainer.createDiv('chat-conversation');

		const inputEl = personaChatContainer.createEl('textarea', {
			cls: 'chat-input',
			attr: {
				placeholder: 'Type a message...',
				rows: 3
			}
		});

		inputEl.addEventListener('keydown', async (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				// Prevent the default action to avoid submitting the form
				e.preventDefault();
				this.submitMessage(inputEl.value);
				inputEl.value = "";
			}
		});
		setTimeout(() => inputEl.focus(), 100);

	}

	addMessage(message: ChatMessage) {
		const messageEl = document.createElement('div');
		messageEl.classList.add('chat-message');
		messageEl.addClass(message.isUser ? 'chat-message-user' : 'chat-message-ai');

		MarkdownRenderer.render(this.app, message.message, messageEl.createDiv(), "./", this.component);

		this.conversationEl.prepend(messageEl);
	}

	async submitMessage(message: string) {
		const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
		// Run your function with the input value
		this.addMessage(new ChatMessage(message, true));
		this.conversationEl.prepend(this.createLoadingMessage());
		this.chatBot.question(markdownView.editor.getValue(), message)
			.then((response: string) => {
				if (this.conversationEl.firstElementChild) {
					this.conversationEl.removeChild(this.conversationEl.firstElementChild);
				}
				this.addMessage(new ChatMessage(response, false));
			});

	}

	createLoadingMessage() {
		// Create the container for the loading message
		const loadingContainer = document.createElement('div');
		loadingContainer.className = 'chat-message chat-message-ai';

		for (let i = 0; i < 3; i++) {
			const dot = document.createElement('span');
			dot.textContent = '.';
			dot.className = 'chat-message-loading-dot';
			loadingContainer.appendChild(dot);
		}

		// Return the constructed loading message
		return loadingContainer;
	}

	async onClose() {
		// Nothing to clean up.
	}

	async setState(state: any, result: ViewStateResult): Promise<void> {
		this.title = state.title;
		this.chatBot = new FeedBackPersonaBot(this.settings, state.persona);

		super.setState(state, result);
		this.loadChat()
	}
}

export async function activatePersonaChatView(title: string, persona: string) {
	await this.app.workspace.getRightLeaf(false).setViewState({ type: VIEW_TYPE_PERSONA_CHAT, active: true, state: { title: title, persona: persona } })
}
