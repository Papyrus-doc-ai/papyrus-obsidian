export class Task {
	task: string;
	reasoning: string;
	category: string;
	subtasks: string[];
	dependencies: string[];
	notes: string;
	priority: string;
	cost: string;

	constructor(task: string, reasoning: string, category: string, subtasks: string[], dependencies: string[], notes: string, priority: string, cost: string) {
		this.task = task;
		this.reasoning = reasoning;
		this.category = category;
		this.subtasks = subtasks;
		this.dependencies = dependencies;
		this.notes = notes;
		this.priority = priority;
		this.cost = cost;
	}

	toPrettyMarkdownString(): string {
		return '## Task: ' + this.task + '\n' +
			'- **Reasoning** : ' + this.reasoning + '\n' +
			'- **Category** : ' + this.category + '\n' +
			(this.subtasks && this.subtasks.length > 0 ? '- **Subtasks** :' + this.subtasks.join(", ") + '\n' : '') +
			(this.dependencies && this.dependencies.length > 0 ?  '- **Dependencies** : ' + this.dependencies.join(", ") + '\n' : '') +
			(this.notes ? '- **Notes** : ' + this.notes + '\n' : '')+
			'- **Priority** : ' + this.priority + '\n' +
			'- **Cost** : ' + this.cost + '\n';
	}

	extractMainInfo(): string {
		return '- [ ] Task: ' + this.task + '\n' +
			'    - **Category** : ' + this.category + '\n' +
			(this.subtasks && this.subtasks.length > 0 ? '    - **Subtasks** :' + this.subtasks.join(", ") + '\n' : '') +
			(this.dependencies && this.dependencies.length > 0 ?  '    - **Dependencies** : ' + this.dependencies.join(", ") + '\n' : '') +
			(this.notes ? '    - **Notes** : ' + this.notes + '\n' : '')+
			'    - **Priority** : ' + this.priority + '\n' +
			'    - **Cost** : ' + this.cost + '\n';
	}

	static fromJSON(value: any) {
		return new Task(
			value["task"],
			value["reasoning"],
			value["category"],
			value["subtasks"],
			value["dependencies"],
			value["notes"],
			value["priority"],
			value["cost"]
		);
	}
}
