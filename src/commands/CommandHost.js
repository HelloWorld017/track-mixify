const Command = require('./Command');

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

		try {
			this.bot.sendHtml(
				`<a href="${this.bot.config.target}/${token}">여기를 눌러 호스트</a>`,
				update.message.from.id
			);
		} catch(e) {
			return '봇에게 먼저 말을 걸어주세요!';
		}
		
		return '개인톡을 확인해주세요!';
	}
}

module.exports = CommandHost;
