import { App, TFile } from "obsidian";

export async function getOrCreateFile(filePath: string, app: App): Promise<TFile> {
    let abfile  = app.vault.getAbstractFileByPath(filePath);
    if (abfile instanceof TFile) {
        return abfile;
    } else {
        return await app.vault.create(filePath, "");
    }
}