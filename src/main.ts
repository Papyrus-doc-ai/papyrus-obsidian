import { App, Plugin, PluginSettingTab, Setting, Notice } from 'obsidian';
import { TechReviewView, VIEW_TYPE_TECH_REVIEW } from './content-review/content-review.view';
import { GeneratorView, VIEW_TYPE_GENERATOR } from './analyser/analyser.view';

import { PersonaChatView, VIEW_TYPE_PERSONA_CHAT } from './persona-chat/persona-chat.view';
import { FormatImporterCommand } from "./formater/importer.command";
import { GrammarCorrectorCommand } from './grammar-corrector/grammar-corrector.command';
import { MarkdownComparatorConfirmView, VIEW_TYPE_MARKDOWN_COMPARATOR } from './utils/markdown-comparator.util';
import { AnalysisCommand } from './analyser/analyser.command';
import { TaskifierCommand } from './taskifier/taskfier.command';
import { FormatExporterCommand } from './formater/exporter.command';
import { PersonaChatCommand } from './persona-chat/persona-chat.command';
import { ContentReviewCommand } from './content-review/content-review.command';
import { TranslatorCommand } from './translator/translator.command';
import { ClientSettings } from 'libs/papyrus-brainiac';

interface PapyrusPluginSettings extends ClientSettings {
	openAIKey: string;
	gptModel: string;
}

const DEFAULT_SETTINGS: PapyrusPluginSettings = {
	openAIKey: '',
	gptModel: 'gpt-3.5-turbo-0125',
}

export default class PapyrusPlugin extends Plugin {
	settings: PapyrusPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_TECH_REVIEW,
			(leaf) => new TechReviewView(leaf, this.settings)
		);

		this.registerView(
			VIEW_TYPE_PERSONA_CHAT,
			(leaf) => new PersonaChatView(leaf, this.settings)
		);

        this.registerView(
            VIEW_TYPE_GENERATOR,
            (leaf) => new GeneratorView(leaf, this.settings)
        );

		this.registerView(
			VIEW_TYPE_MARKDOWN_COMPARATOR,
			(leaf) => new MarkdownComparatorConfirmView(leaf)
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PapyrusSettingTab(this.app, this));

		this.addCommand({
			id: 'structure-analysis',
			name: 'Analyse project structure',
			callback: () => {
				new AnalysisCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'format-exporter',
			name: 'Extract template from document',
			callback: () => {
				new FormatExporterCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'format-importer',
			name: 'Import template to document',
			callback: () => {
				new FormatImporterCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'taskifier',
			name: 'Create actionable tasks from document',
			callback: () => {
				new TaskifierCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'correct-grammar',
			name: 'Correct document\'s grammar',
			callback: () => {
				new GrammarCorrectorCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'translator',
			name: 'Translate document to another language',
			callback: () => {
				new TranslatorCommand(this.app, this.settings).execute();
			}
		});

		this.addCommand({
			id: 'persona-chat',
			name: 'Chat with a custom Persona',
			callback: () => {
				new PersonaChatCommand(this.app).execute();
			}
		});

		this.addCommand({
			id: 'content-review',
			name: 'Review document\'s content',
			callback: () => {
				new ContentReviewCommand(this.app).execute();
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PapyrusSettingTab extends PluginSettingTab {
	plugin: PapyrusPlugin;

	constructor(app: App, plugin: PapyrusPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		
		new Setting(containerEl)
			.setName("OpenAI Key")
			.setDesc("Key to access OpenAI's APIs")
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.openAIKey)
				.onChange(async (value) => {
					this.plugin.settings.openAIKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("GPT model")
			.setDesc("Choose which GPT model to use")
			.addDropdown(dropdown => {
				dropdown.addOptions({
					'gpt-4o': "GPT-4o",
					'gpt-4o-mini': "GPT-4o mini",
					'gpt-4-turbo': "GPT-4"
				})
				.setValue(this.plugin.settings.gptModel)
				.onChange(async (value) => {
                    this.plugin.settings.gptModel = value;
                    await this.plugin.saveSettings();
                });
			});

		new Setting(containerEl)
			.addButton(btn => btn
				.setButtonText("Save Settings")
				.setCta()
				.onClick(() => {
					this.plugin.load();
					new Notice("Papyrus: Settings Saved");
				}));
	}
}

