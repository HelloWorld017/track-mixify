class CommandHost extends Command {
	constructor(bot) {
		super(bot, '호스트');
	}

	async doExecute(args, update) {
		const chatId = update.message.chat.id;
		const token = Math.random().toString(36).slice(2);

		this.bot.tokens[token] = chatId;
		Object.keys(this.bot.tokens).forEach(key => {
			if(this.bot.tokens[key] === chatId)
				delete this.bot.tokens[key];
		});

		this.bot.sendHtml(
			`<a href="${this.bot.config.target}/${token}">여기를 눌러 호스트</a>`,
			update.message.from.id
		);
	}
}

module.exports = CommandQueue;
