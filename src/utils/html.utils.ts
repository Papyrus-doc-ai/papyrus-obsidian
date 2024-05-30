import { marked } from "marked";

export class CheckBoxElement {
    inputElement: HTMLInputElement
    text: string
    
    constructor(
        text: string, 
        parent: HTMLElement, 
        containerInfo?: DomElementInfo, 
        labelInfo?: DomElementInfo, 
        inputInfo?: DomElementInfo)
    {
        this.text = text;

        const container = parent.createDiv(containerInfo);
        
        let labelDomInfo: DomElementInfo = CheckBoxElement.createDomElementInfoFrom(labelInfo);
        let inputDomInfo: DomElementInfo = CheckBoxElement.createDomElementInfoFrom(inputInfo);
        
        labelDomInfo.text = this.text;
        inputDomInfo.attr = getOrDefault(inputDomInfo.attr, {});
        inputDomInfo.attr.type = "checkbox";

        this.inputElement = container.createEl("input", inputDomInfo);
        container.createEl("label", labelDomInfo)

    }

    isChecked(): boolean {
        return this.inputElement.checked;
    }

    private static createDomElementInfoFrom(domInfo?: DomElementInfo): DomElementInfo {
        return getOrDefault(domInfo, {});
    }
}

function getOrDefault<T>(target: T | undefined, defaultValue: T): T {
    if (target != undefined)
        return target;
    return defaultValue; 
}

export function convertMarkdownToHTML(markdown: string): string{
    return marked(markdown).toString();
}