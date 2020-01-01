const bodyParser = require('body-parser');
const config = require('./config.json');
const express = require('express');
const http = require('http');
const path = require('path');

const Bot = require("./src/Bot");

(async () => {
	const bot = new Bot(config);
	await bot.init();

	const app = express();
	app.use(bodyParser.json({strict: false}));

	app.use((req, res, next) => {
		next();
	});

	app.post(`/bot/${config.token}`, async (req, res) => {
		bot.update(req.body);
		res.status(200).send('Done, TrackMixify');
	});

	app.param('token', (req, res, next, token) => {
		if(!bot.tokens.hasOwnProperty(token)) {
			res.status(404).send("Not Found :(");
			return;
		}

		req.chat = bot.chats[bot.tokens[token]];
		next();
	});

	app.get('/:token', (req, res) => {
		res.sendFile(path.resolve(__dirname, './app/dist/index.html'));
	});

	app.post('/:token/next', (req, res) => {
		const nextItem = req.chat.hostQueue.next();
		const queue = req.chat.hostQueue.queue;
		
		res.json({
			next: nextItem,
			queue
		});
	});

	app.get('/:token/queue', (req, res) => {
		res.json(req.chat.hostQueue.queue);
	});

	app.use(express.static(path.resolve(__dirname, 'app', 'dist')));

	const server = http.createServer(app);
	server.listen(config.port);

	const io = socketIo(server);
	io.on('connection', socket => {
		socket.on('authenticate', token => {
			if(bot.tokens.includes(token)) {
				socket.join(token);
			}
		});
	});

	bot.on('refresh', token => {
		io.of(token).emit('refresh');
	});
})();
