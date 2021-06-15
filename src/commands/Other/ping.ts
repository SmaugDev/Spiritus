import Command from '../CommandClass';

export default class Ping extends Command {

	constructor(spiritus: any) {
		super(spiritus, {
			name: 'ping',
			aliases: [],
			args: [],
			description: 'Get ping of the bot',
			category: 'Other',
			cooldown: 5,
			userPermissions: [],
			botPermissions: [],
			subCommands: []
		})
	}
	async execute(interaction: any) {
		interaction.reply('Pong !')

	}
}