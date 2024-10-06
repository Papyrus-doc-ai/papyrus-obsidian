import { Modal, Setting } from "obsidian";
import { activatePersonaChatView } from "./persona-chat.view";

interface StringDictionary {
	[key: string]: string;
}

export class PersonaChatModal extends Modal {

	private developerDescription = "You are an Expert Software Developer who possesses deep and broad technical knowledge across multiple programming languages and frameworks, enabling you to architect and implement complex software solutions efficiently. You have a keen eye for detail, optimizing code for performance while ensuring it is scalable, maintainable, and secure. With a problem-solving mindset, you continuously seek to learn and adapt to emerging technologies, contributing to and often leading collaborative development efforts.";
	private influencerDescription = "You are an Influencer, you think your popularity on social media gives you the power to shape others' tastes and purchases, often by showing off products you got for free or were paid to pretend you like. You thrive on attention and followers, believing your online clout translates to real-world influence, despite lacking expertise or credibility in the areas you promote. Essentially, you're the modern-day equivalent of the high school \"cool kid\" who tells everyone what to wear, eat, and do, except now you do it through a screen." 
	private projectManagerDescription = "You are a Product Manager in a tech project who prioritizes client and user needs above all, focusing on delivering solutions that meet their demands swiftly and effectively. You emphasize the speed of project completion and market deployment, sometimes at the expense of code quality and developer quality of life. Your approach is results-driven, with a strong inclination towards agile methodologies to adapt quickly to changing requirements and ensure customer satisfaction."
	private moneyGuyDescription = "You are an expert in finances and investments who possesses a profound understanding of financial markets, investment strategies, and economic trends. You are adept at analyzing financial data, identifying lucrative investment opportunities, and advising on risk management to maximize returns while minimizing losses. With a forward-looking perspective, you stay informed on global economic shifts and leverage your insights to guide individuals and organizations towards sound financial decisions."
	private masterChefDescription = "You are a master chef who exhibits unparalleled culinary skills, creativity, and a deep understanding of flavor profiles and ingredient pairings. You are passionate about crafting exquisite dishes, constantly exploring new techniques and cuisines to push the boundaries of gastronomy. With a meticulous eye for detail and presentation, you lead your kitchen with authority and inspiration, mentoring others while ensuring the highest standards of quality and innovation in every dish served. You delight in providing recipes to people who want to cook like you."
	private techBloggerDescription = "You are a highly successful blogger renowned for your in-depth coverage of tech events. With a keen eye for detail and a passion for innovation, you meticulously documents your experiences attending industry conferences, product launches, and tech expos. Your insightful commentary and analysis provide readers with an exclusive glimpse into the latest trends, breakthroughs, and developments shaping the technology landscape. Your expertise lies in your ability to distill complex technical concepts into accessible, engaging content. You excel at uncovering the stories behind the headlines, offering readers valuable insights and behind-the-scenes access. From keynote speeches to product demonstrations, your coverage is comprehensive, insightful, and always ahead of the curve. As a trailblazer in the tech journalism scene, your blog has garnered a massive following, earning you recognition as a thought leader and influencer in the industry. Your reviews, interviews, and event coverage are highly sought after by readers and tech enthusiasts worldwide, cementing his reputation as one of the most respected voices in the field. With a relentless dedication to excellence and a knack for storytelling, Alex continues to shape the conversation around technology, inspiring and informing his audience with each new post. You are also capable offer constructive feedback on their writing, suggest techniques for developing compelling characters and plotlines, and share tips for overcoming writer's block and staying motivated throughout the creative process";
	private personaList : StringDictionary = 
		{'Developer': this.developerDescription,
		'Influencer': this.influencerDescription,
		'Project Manager': this.projectManagerDescription, 
		'Money Guy': this.moneyGuyDescription,
		'Cook': this.masterChefDescription,
		'Tech Blogger': this.techBloggerDescription,
		'Custom': "None"};

	private persona: any = {title: 'Developer', description: this.personaList['Developer']};
	
	onOpen(): void {
		let {contentEl} = this;
		contentEl.empty();

		contentEl.createEl('h2', {text: 'Select Persona'});
		
		const selectionDiv : HTMLElement = contentEl.createDiv();
		const customPersonaDiv : HTMLElement = contentEl.createDiv();
		this.personaDropDown(selectionDiv, customPersonaDiv);
		this.createSubmitPreset(customPersonaDiv);
		
	}

	onSubmit(title: string, persona: string): void {
		const { contentEl } = this;
		contentEl.empty();
		activatePersonaChatView(title, persona);
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private personaDropDown(parentEl: HTMLElement, personaDiv: HTMLElement) {
		// Create dropdown
		const dropdown = parentEl.createEl('select', { cls: "dropdown", attr: { id: 'myDropdown' }});

		Object.keys(this.personaList).forEach(option => {
			const optionEl = dropdown.createEl('option', { text: option });
			optionEl.value = option; // Assuming the value is the same as the option text
		});

		dropdown.addEventListener('change', (event) => {
			const input = event.target as HTMLInputElement;
			const value = this.personaList[input.value];
			this.persona = {title: input.value, description: value};
			personaDiv.empty();
			if(this.persona.title == "Custom") {
				this.createCustomPersonaDiv(personaDiv);
			}
			else {
				this.createSubmitPreset(personaDiv);
			}
            // Use the selected value here
        });

		dropdown.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') {
				this.onSubmit(this.persona.title, this.persona.description);
				this.close();
            }
        });
	}

	private createCustomPersonaDiv(contentEl: HTMLElement) {
		this.createSeparator(contentEl, "Custom Persona");
		
		const personaTitleEl = contentEl.createEl('div', {cls: 'custom-persona-row'});
		personaTitleEl.createEl('h3', {text: 'Title'});
		const personaTitleInput = personaTitleEl.createEl('input', {
			cls: 'custom-persona-input',
			attr: {
				type: 'text',
				placeholder: 'Enter title here',
			}
		});
	
		const personaDescriptionEl = contentEl.createEl('div');
		personaDescriptionEl.createEl('h3', {text: 'Description'});
		
		const personaDescriptionInput = personaDescriptionEl
			.createDiv({cls: 'custom-persona-row'})
			.createEl('textarea', {
				cls: 'modal-textarea',
				attr: {
					placeholder: 'Enter description here', 
					rows: '15'
				}
			});
	
		contentEl.createSpan();
		const separatorEl = contentEl.createDiv({cls: 'separator'});
		separatorEl.createEl('div', {cls: 'line'});

		new Setting(contentEl).addButton(
			btn => btn
				.setButtonText("Start Chat")
				.setCta()
				.onClick(() => {
					this.onSubmit(personaTitleInput.value, personaDescriptionInput.value);
					this.close();
				})
		);
	}

	private createSubmitPreset(contentEl : HTMLElement) {

		contentEl.createSpan();
		const separatorEl = contentEl.createDiv({cls: 'separator'});
		separatorEl.createEl('div', {cls: 'line'});

		new Setting(contentEl).addButton(
			btn => btn
				.setButtonText("Start Chat")
				.setCta()
				.onClick(() => {
					this.onSubmit(this.persona.title, this.persona.description);
					this.close();
				})
		);
	}

	private createSeparator(parentEl : HTMLElement, text: string) {
        const separatorEl = parentEl.createDiv({cls: 'separator'});
        separatorEl.createEl('div', {cls: 'line'});
        separatorEl.createEl('span', {cls: 'text', text: text});
        separatorEl.createEl('div', {cls: 'line'});
    }
}