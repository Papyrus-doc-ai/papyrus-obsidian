import { Editor, EditorPosition } from "obsidian";

export function getEndOfEditor(editor: Editor): EditorPosition {
  return { ch: editor.getLine(editor.lastLine()).length, line: editor.lastLine()};
}

export function clearEditor(editor: Editor) {
  editor.replaceRange("", { ch: 0, line: 0}, getEndOfEditor(editor));
}