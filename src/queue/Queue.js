class Queue {
	constructor(queueId, chat) {
		this.id = queueId;
		this.chat = chat;
		this.queue = [];
		this.all = [];
	}

	add(songObject) {
		const user = this.chat.users[this.id];
		songObject.owner = user.username || user.id;

		this.queue.push(songObject);
		this.all.push(songObject);
		this.onChange(true);
	}

	remove(index) {
		this.queue.splice(index, 1);
		this.onChange(true);
	}

	next() {
		if(this.queue.length === 0) return null;
		const nextItem = this.queue.shift();
		this.onChange(false);
		
		return nextItem;
	}
	
	onChange(emit) {
		if(emit) {
			this.chat.bot.emit('refresh', this.chat.id);
		}
		
		this.chat.save();
	}

	serialize() {
		return {
			id: this.id,
			queue: this.queue,
			all: this.all
		};
	}

	static deserialize(queueObj, chat) {
		const queue = new Queue(queueObj.id, chat);
		queue.queue = queueObj.queue;
		queue.all = queueObj.all;

		return queue;
	}
}

module.exports = Queue;
