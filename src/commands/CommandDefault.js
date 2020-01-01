const axios = require("axios");
const fs = require('fs');
const promisePipe = require("promisepipe");
const ytdl = require('ytdl-core')

const Command = require('./Command');

const YT_REGEX = /^(?:https?\:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ \r\n]+)$/;

class CommandDefault extends Command {
	constructor(bot) {
		super(bot, '');
	}

	isStatementCommand(update) {
		return update.message.audio || update.message.text;
	}

	async execute({message}) {
		const chat = this.bot.getChat(message.chat.id);

		if(message.audio) {
			const title = message.audio.title;
			const file = await this.bot.fetch('getFile', {file_id: message.audio.file_id});
			if(!file || !file.file_path) {
				this.bot.sendHtml("파일을 다운받을 수 없습니다 T_T", message.chat.id);
				return;
			}

			this.bot.sendHtml("파일을 다운받는 중...", message.chat.id);

			try {
				const {data: fileStream} = await axios({
					method: 'get',
					url: `https://api.telegram.org/file/bot${this.bot.config.token}/${file.file_path}`,
					responseType: 'stream'
				});

				await promisePipe(fileStream, fs.createWriteStream(`./data/${file.file_unique_id}`));
			} catch(err) {
				this.bot.sendHtml("파일 다운에 실패한 것이야요 T_T", message.chat.id);
				return;
			}

			const queue = chat.getQueue(message.from.id);
			queue.add({
				title: "텔레그램 음악",
				file: `./data/${file.file_unique_id}`,
				type: "file"
			});
		} else {
			const youtubeUrl = message.text;
			const match = youtubeUrl.match(YT_REGEX);
			if(!match) {
				return;
			}

			const title = await new Promise(resolve => {
				ytdl.getInfo(match[1], (err, info) => {
					if(err) return resolve("Unknown");

					resolve(info.title);
				});
			});

			const queue = chat.getQueue(message.from.id);
			queue.add({
				title,
				id: match[1],
				type: "youtube"
			});
		}

		this.bot.sendHtml("성공적으로 추가했습니다", message.chat.id, {
			reply_to_message_id: message.message_id
		});
	}
}

module.exports = CommandDefault;
