# Obsidian Papyrus

Enhance your [Obsidian](https://github.com/blacksmithgu/obsidian-dataview?tab=readme-ov-file) experience with **Papyrus** through the use of generative AI. With the press of a button dramatically improve your document's grammar or find flaw's in its structure and then correct them.

## Usage

### Setting up

[Generate an api key in OpenAI](https://platform.openai.com/api-keys). Set the field `OpenAI Key` in the settings of the plugin with the generated key.

Select the target Model and hit `Save Settings`. You're ready to go!

### Split Screen Editor

Most commands have a purpose of overriding the document currently being edited, however that may lead to wanted information being deleted by mistake or unwanted info being added. 

So, in those cases **Papyrus** creates a temporary file with the proposed changes, opens in "split-screen-style" and a right-sidebar with a button to accept the changes or refuse them.

This way the user can double check the information and even make edits to the new version as they see fit.

#### Example

![Correct Grammer Command Example](docs/img/CorrectGrammar.example.png)

### Available Commands

All accessible through the Obsidian's `Command Palette`

#### Analyse Project Structure

`Papyrus: Analyse project structure`

**TODO**

#### Review Document's Content

`Papyrus: Review document's content`

**TODO**

#### Correct Document's Grammar

`Papyrus: Correct document's grammar`

Opens a [Split Screen Editor](#split-screen-editor) with a version of the document with it's grammar corrected.

![Correct Grammer Command Example](docs/img/CorrectGrammar.example.png)

#### Chat with a Custom Persona

`Papyrus: Chat with a custom Persona`

**TODO**

#### Import Template to Document

`Papyrus: Import template to document`

**TODO**

#### Extract Template from Document

`Papyrus: Extract template from document`

This command analyses the provided document and creates a template which can be then used as a starting point for future similar documents.

You can define the name of the file in which it will be stored. That filed is then created under the folder `/templates`

![alt text](docs/img/ExtractTemplatePrompt_example.png)

#### Create Actionable Tasks from Document

`Papyrus: Create actionable tasks from document`

**TODO**

#### Translate Document to Another Language

`Papyrus: Translate document to another language`

It translates the document into English. Opens a [Split Screen Editor](#split-screen-editor) with the translated version.

![Note Translated from Portuguese to English](docs/img/TranslateDocumentToAnotherLanguage.example.png)

## Installation

How to install

Not 100% how would this work with the brainiac library

**TODO**
