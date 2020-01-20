class QueueHost {
	constructor(queueId, chat) {
		this.id = queueId;
		this.name = 'host';
		this.chat = chat;
		this.robin = 0;
	}

	add() {}
	remove() {}

	next() {
		const values = Object.values(this.chat.queues);
		const nextRobin = this.getNextRobin(this.robin, values);
		if(nextRobin === -1) return null;
		
		this.robin = nextRobin;
		return values[nextRobin].next();
	}

	getNextRobin(robinStart, queues = null) {
		if(robinStart === undefined)
			robinStart = this.robin;

		if(!queues)
			queues = Object.values(this.chat.queues);

		if(queues.length === 0) return -1;
		
		let i = null;
		for(; i !== robinStart + 1; i = (i + 1) % queues.length) {
			if(i === null) i = (robinStart + 1) % queues.length;
			if(queues[i].queue.length > 0)
				break;
		}

		if(queues[i].queue.length === 0)
			return -1;

		return i;
	}

	get queue() {
		const queues = Object.values(this.chat.queues);
		const musicQueue = [];

		for(let i = null; i !== this.robin + 1; i = (i + 1) % queues.length) {
			if(i === null) i = this.robin + 1;
			if(queues[i].queue.length > 0)
				musicQueue.push(queues[i].queue[0]);
		}

		return musicQueue;
	}
}

module.exports = QueueHost;
