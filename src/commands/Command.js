const findCommand = v => message => {
	return message.startsWith(`!${v} `) ||
	  message === `!${v}`;
};

class Command {
	constructor(bot, commandName) {
		this.bot = bot;
		this.name = commandName;
		this.findCommand = findCommand(this.name);
	}

	isStatementCommand(update) {
		if(!update.message || !update.message.text)
			return false;

		console.log(update.message.text, this.name);
		return this.findCommand(update.message.text);
	}

	async execute(update) {
		const {message: {text}} = update;
		const rawArgs = text.slice(2 + this.name.length);
		const argsList = rawArgs.split(' ').filter(v => v.length);

		const returnText = await this.doExecute(argsList, update);
		if(returnText)
			await this.bot.sendHtml(returnText, update.message.chat.id);
	}

	async doExecute(args, update) {

	}
}

module.exports = Command;
