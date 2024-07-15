# Obsidian Papyrus

Enhance your [Obsidian](https://github.com/blacksmithgu/obsidian-dataview?tab=readme-ov-file) experience with **Papyrus** through the use of generative AI. With the press of a button dramatically improve your document's grammar or find flaw's in its structure and then correct them.

## Usage

### Setting up

[Generate an api key in OpenAI](https://platform.openai.com/api-keys). Set the field `OpenAI Key` in the settings of the plugin with the generated key.

Select the target Model and hit `Save Settings`. You're ready to go

### Available Commands

All accessible through the Obsidian's `Command Palette`

#### Analyse Project Structure

`Papyrus: Analyse project structure`

#### Review Document's Content

`Papyrus: Review document's content`

#### Correct Document's Grammar

`Papyrus: Correct document's grammar`

It creates a temporary file with the document's content, but with its grammar corrected, and opens it in split view with the document.

This way, the user can edit as they may without overriding the original document right away.

Finally, one may choose to override the original document or discard the new version

![Correct Grammer Command Example](docs/img/CorrectGrammar.example.png)

#### Chat with a Custom Persona

`Papyrus: Chat with a custom Persona`

#### Import Template to Document

`Papyrus: Import template to document`

#### Extract Template from Document

`Papyrus: Extract template from document`

#### Create Actionable Tasks from Document

`Papyrus: Create actionable tasks from document`

#### Translate Document to Another Language

`Papyrus: Translate document to another language`

It translates the document into English.

![Note Translated from Portuguese to English](docs/img/TranslateDocumentToAnotherLanguage.example.png)

## Installation

How to install

Not 100% how would this work with the brainiac library
