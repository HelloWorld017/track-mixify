const sanitizeFilename = require('sanitize-filename');
const Queue = require('./queue/Queue');
const QueueHost = require('./queue/QueueHost');

class Chat {
	constructor(chatId) {
		this.id = chatId;
		this.users = {};
		this.hostQueue = new QueueHost();
		this.queues = {};
	}

	getQueue(queueId) {
		if(!this.queues.hasOwnProperty(queueId))
			this.queues[queueId] = new Queue(queueId);

		return this.queues[queueId];
	}

	findUser(userType) {
		if(userType === '') return null;

		const userTypeAt = userType[0] === '@' ? userType.slice(1) : userType;

		const user = Object.values(this.users).find(user => {
			if(user.id === parseInt(userType) || user.username === userTypeAt)
				return true;
		});

		if(!user) return null;
		return user.id;
	}

	async save() {
		const chat = JSON.stringify(this.serialize());
		await fs.promises.writeFile(sanitizeFilename(`./chat/${this.id}.json`), chat);
	}

	serialize() {
		const queues = Object.values(this.queues).map(queue => queue.serialize());
		return {
			id: this.id,
			users: this.users,
			queues
		};
	}

	static deserialize(chatObj) {
		const chat = new Chat(chatObj.id);
		chat.users = chatObj.users;
		chatObj.queues.forEach(queueObj => {
			const queue = Queue.deserialize(queueObj);
			chat.queues[queue.id] = queue;
		});
	}
}

module.exports = Chat;
