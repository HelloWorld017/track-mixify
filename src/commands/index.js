const CommandDefault = require('./CommandDefault');
const CommandQueue = require('./CommandQueue');

module.exports = bot => {
	const commands = [
		CommandQueue,
		CommandDefault
	];

	return commands.map(CommandClass => {
		return new CommandClass(bot);
	});
};
