const Command = require('./Command');
class CommandQueue extends Command {
	constructor(bot) {
		super(bot, '큐');
	}

	async doExecute(args, update) {
		const chatId = update.message.chat.id;
		const queueName = (args.length < 1) ?
			(update.message.from.username || update.message.from.id) :
			args[0];

		const chat = this.bot.getChat(chatId);
		const userId = chat.findUser(queueName);

		if(!userId)
			return "해당하는 큐가 없습니다!"

		if(!chat.queues.hasOwnProperty(userId))
			return "해당하는 큐가 없습니다!";

		const queue = chat.queues[userId];

		return `<b>${queueName}</b> 의 큐\n` +
			queue.queue.reduce((prev, curr, i) => {
				return prev + `${i + 1}. ${curr.title}\n`
			}, '');
	}
}

module.exports = CommandQueue;
