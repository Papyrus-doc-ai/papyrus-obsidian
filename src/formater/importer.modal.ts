import { FormatImporter } from "libs/papyrus-brainiac";
import { App, FuzzySuggestModal, MarkdownView, TFile } from "obsidian";
import { LoadingModal } from "src/modals/loading.modal";
import { MarkdownComparator } from "src/utils/markdown-comparator.util";

export class FormatPickerModal extends FuzzySuggestModal<TFile> {

	private formatImporter: FormatImporter;
	private document: string;

	constructor(app: App, formatImporter: FormatImporter, document: string) {
		super(app);
		this.formatImporter = formatImporter;
		this.document = document;
		this.setPlaceholder("Choose a template");
	}

	getTemplates(): TFile[] {
		const templateFolder = 'templates';
		const templateFiles:any = this.app.vault.getFolderByPath(templateFolder)?.children;
		return templateFiles.filter((file: any) => file instanceof TFile) as TFile[];
	}

	getItems(): TFile[] {
		return this.getTemplates();
	}
	getItemText(item: TFile): string {
		return item.name;
	}
	onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent): void {

		new LoadingModal(
			this.app,
			async () => await this.formatImporter.import(await this.app.vault.read(item), this.document),
			async (newDocument: string) => {
				const originalFileTrying: TFile | null | undefined = this.app.workspace.getActiveViewOfType(MarkdownView)?.file;

				if (originalFileTrying == null) {
					console.error("File not open");
					return;
				}

				const originalFile: TFile = originalFileTrying!;

				await new MarkdownComparator(
					this.app,
					originalFile,
					newDocument,
					"DocumentWithAppliedTemplate.md")
				.getShitDone();
			})
		.open();
	}

	async loadFile(filePath: string): Promise<string> {
		try {
			return await this.app.vault.adapter.read(filePath+ ".md");
		} catch (error) {
			console.error(`Failed to load file: ${filePath}`, error);
			return "";
		}
	}
}