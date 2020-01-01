const axios = require("axios");
const commands = require("./commands");
const fs = require("fs");
const packageInfo = require("../package.json");
const path = require("path");
const util = require("util");

const Chat = require('./Chat');
const EventEmitter = require('events');

class Bot extends EventEmitter {
	constructor(config) {
		this.chats = {};
		this.tokens = {};
		this.commands = commands(this);
		this.basePath = path.resolve('.', 'data');
		this.config = config;

		this.axios = axios.create({
			baseURL: `https://api.telegram.org/bot${config.token}/`,
			headers: {
				'User-Agent': `TrackMixify ${packageInfo.version}`,
				'Content-Type': 'application/json'
			}
		});
	}

	async init() {
		await this.load();
		await this.fetch('setWebhook', {
			url: `${this.config.target}/bot/${this.config.token}`
		});

		console.log("웹훅이 설정되었습니다!");
	}

	async fetch(target, options, throwError = false) {
		try {
			const {data} = await this.axios.post(target, JSON.stringify(options));
			return data ? data.result : '';
		} catch(e) {
			if(!throwError) {
				console.error(e);
				return;
			}

			throw e;
		}
	}

	async sendHtml(message, id, options={}) {
		const descriptor = {
			text: message,
			chat_id: id,
			parse_mode: 'HTML'
		};

		Object.keys(options).forEach(k => descriptor[k] = options[k]);

		await this.fetch('sendMessage', descriptor);
	}

	async update(update) {
		if(update.message && update.message.from && update.message.chat) {
			const chat = this.getChat(update.message.chat.id);
			chat.users[update.message.from.id] = update.message.from;
		}

		const command = this.commands.find(command => command.isStatementCommand(update));
		if(command) {
			await command.execute(update);
		}
	}

	getChat(chatId) {
		if(!this.chats.hasOwnProperty(chatId))
			this.chats[chatId] = new Chat(chatId, this);

		return this.chats[chatId];
	}

	async load() {
		try {
			const chats = await fs.promises.readdir('./chats');
			for (const chatFile of chats) {
				const chatStr = await fs.promises.readFile(path.join('./chats', chatFile), 'utf-8');
				const chatObj = JSON.parse(chatStr);

				this.chats[chatObj.id] = Chat.deserialize(chatObj, this);
			}
		} catch(e) {}
	}
}

module.exports = Bot;
