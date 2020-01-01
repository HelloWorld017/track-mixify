class Queue {
	constructor(queueId, queueName) {
		this.id = queueId;
		this.name = queueName;
		this.queue = [];
		this.all = [];
	}

	add(songObject) {
		this.queue.push(songObject);
		this.all.push(songObject);
	}

	remove(index) {
		this.queue.splice(index, 1);
	}

	next() {
		if(this.queue.length === 0) return null;
		return this.queue.shift();
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			queue: this.queue,
			all: this.queue
		};
	}

	static deserialize(queueObj) {
		const queue = new Queue(queueObj.id);
		queue.name = queueObj.name;
		queue.queue = queueObj.queue;
		queue.all = queueObj.all;

		return queue;
	}
}

module.exports = Queue;
