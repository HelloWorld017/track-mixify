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
		const nextRobin = this.getNextRobin();
		if(nextRobin === -1) return null;

		return Object.values(this.chat.queues)[nextRobin].next();
	}

	getNextRobin(robinStart, queues = null) {
		if(!robinStart)
			robinStart = this.robin;

		if(!queues)
			queues = Object.values(this.chat.queues);

		if(queues.length === 0) return -1;

		let robin = robinStart;

		do {
			robin = (robin + 1) % queues.length;
		} while(robinStart !== robin && queues[robin].queue.length > 0);

		if(queues[robin].queue.length === 0)
			return -1;

		return robin;
	}

	get queue() {
		const queues = Object.values(this.chat.queues);

		let robin = this.robin;
		let previousRobin = null;

		const musicQueue = [];
		if(queues[robin].queue[0])
			musicQueue.push(queues[robin].queue[0]);

		do {
			previousRobin = robin;
			robin = this.getNextRobin(robin, queues);
			if(robin < 0)
				break;

			musicQueue.push(queues[robin].queue[0]);
		} while(robin !== previousRobin);

		return musicQueue;
	}
}

module.exports = QueueHost;
