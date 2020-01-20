const CommandDefault = require('./CommandDefault');
const CommandHost = require('./CommandHost');
const CommandQueue = require('./CommandQueue');

module.exports = bot => {
	const commands = [
		CommandQueue,
		CommandHost,
		CommandDefault
	];

	return commands.map(CommandClass => {
		return new CommandClass(bot);
	});
};
