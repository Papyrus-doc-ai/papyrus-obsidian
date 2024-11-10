import { App, ItemView, MarkdownView, WorkspaceLeaf } from "obsidian";
import { ClientSettings, TechCheck } from "libs/papyrus-brainiac";
import { getRightLeaf } from "src/utils/leaf.utils";


export const VIEW_TYPE_TECH_REVIEW = "content-review-view";

export interface TechReviewViewSettings extends ClientSettings {
}

class ReviewItem {
	public claim: string;
	public reasoning: string;
	public corrected: string;

	constructor(claim: string, reasoning: string, corrected: string) {
		this.claim = claim;
		this.reasoning = reasoning;
		this.corrected = corrected;
	}
}

export class TechReviewView extends ItemView {

	private items: ReviewItem[];
	private techCheck: TechCheck;

	constructor(leaf: WorkspaceLeaf, settings: TechReviewViewSettings) {
		super(leaf);
		this.items = [];
		this.techCheck = new TechCheck(settings);
	}

	getViewType() {
		return VIEW_TYPE_TECH_REVIEW;
	}

	getDisplayText() {
		return "Papyrus Tech Review";
	}

	getIcon() {
		return "scroll";
	}

	async onOpen() {
		await this.loadItems()
	}

	async onClose() {
		// Nothing to clean up.
	}

	async loadItems() {
		await this.fetchItems();
		const container = this.containerEl.children[1];
		container.empty();
		container.classList.add("content-review");
		const techReviewContainer = container.createDiv({ cls: "content-review-container" });
		const techReviewSection = techReviewContainer.createDiv({ cls: "content-review-messages" });
		techReviewSection.createEl('h1', { text: "Content Review" });
		if (this.items.length === 0) {
			techReviewSection.createEl('p', { text: "You are perfect just the way you are!" });
		}
		for (let [index, item] of this.items.entries()) {
			techReviewSection.createEl('h3', { text: `Comment ${index + 1}` });
			this.createSeparator(techReviewSection, "Claim");
			techReviewSection.createEl('p', { text: item.claim });
			this.createSeparator(techReviewSection, "Reasoning");
			techReviewSection.createEl('p', { text: item.reasoning });
			this.createSeparator(techReviewSection, "Correction");
			techReviewSection.createEl('p', { text: item.corrected });
			techReviewSection.createEl('div', { cls: 'line' });
		}
	}

	private async fetchItems() {
		const markdownView = this.app.workspace.getLeaf().view as MarkdownView;
		if (markdownView?.editor) {
			this.items = await this.techCheck.factCheck(markdownView.editor.getValue());
		}
	}

	private createSeparator(parentEl: HTMLDivElement, text: string) {
		const separatorEl = parentEl.createDiv({ cls: 'separator' });
		separatorEl.createEl('div', { cls: 'line' });
		separatorEl.createEl('span', { cls: 'text', text: text });
		separatorEl.createEl('div', { cls: 'line' });
	}
}

export async function activateTechReviewView(app: App) {
	getRightLeaf(app, VIEW_TYPE_TECH_REVIEW, {}, false);
}
