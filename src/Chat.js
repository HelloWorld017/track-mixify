const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');
const Queue = require('./queue/Queue');
const QueueHost = require('./queue/QueueHost');

class Chat {
	constructor(chatId, bot) {
		this.bot = bot;
		this.id = chatId;
		this.users = {};
		this.hostQueue = new QueueHost('Host', this);
		this.queues = {};
		this.lastSaveRequest = 0;
		this.lastSave = 0;
	}

	getQueue(queueId) {
		if(!this.queues.hasOwnProperty(queueId))
			this.queues[queueId] = new Queue(queueId, this);

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

	save(force = false) {
		const now = Date.now();
		this.lastSaveRequest = now;
		setTimeout(() => this.saveFinalize(now), 5000);
	}
	
	async saveFinalize(now) {
		if(now !== this.lastSaveRequest && now - this.lastSave < 10000) {
			return;
		}
		this.lastSave = Date.now();
		
		const chat = JSON.stringify(this.serialize());
		await fs.promises.writeFile(`./chat/${sanitizeFilename(`${this.id}.json`)}`, chat);
	}

	serialize() {
		const queues = Object.values(this.queues).map(queue => queue.serialize());
		return {
			id: this.id,
			users: this.users,
			queues
		};
	}

	static deserialize(chatObj, bot) {
		const chat = new Chat(chatObj.id, bot);
		chat.users = chatObj.users;
		chatObj.queues.forEach(queueObj => {
			const queue = Queue.deserialize(queueObj, chat);
			chat.queues[queue.id] = queue;
		});
		return chat;
	}
}

module.exports = Chat;
