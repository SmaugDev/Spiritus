const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, message, args, settings) => {

    switch (args[0].toLowerCase()) {
        case 'list':
            if (settings.commandes) {
                const embed = new MessageEmbed()
                    .setTitle(`List of custom commands of the guid ${message.guild.name}`)
                    .setColor(`${client.config.color.EMBEDCOLOR}`)
                if (message.guild.iconURL()) embed.setThumbnail(`${message.guild.iconURL()}`)
                settings.commandes.forEach(element => {
                    embed.addField(`\u200b`, `Command : \`${element.nom}\``, false)
                });
                message.channel.send(embed)
            } else return message.channel.sendErrorMessage(`No commands found on this guild.`)
            break;
        case 'add':
            try {
                const title = args[1].toLowerCase()
                if (settings.commandes) {
                    if (settings.commandes.length > 19) return message.channel.sendErrorMessage(`You have reached the maximum number of custom commands for this guild`)
                    let customCommand = settings.commandes.find(e => e.nom == title)
                    if (customCommand) return message.channel.sendErrorMessage(`This command already exist on this guild.`)
                }
                const contenu = args.slice(2).join(' ')
                if (contenu.length > 1800) return message.channel.sendErrorMessage(`Content of command is too long. `)
                let tableau = []
                tableau = settings.commandes
                tableau.push({ nom: title, contenu: contenu })
                await client.updateGuild(message.guild, { commandes: tableau });
                message.channel.sendSuccessMessage(`I have created the command \`${title}\`.`);
            } catch (e) { message.channel.sendErrorMessage(`An error occured please try again.`) }
            break;
        case 'rem':
            if (!settings.commandes) return message.channel.sendErrorMessage(`Command not found.`)
            if (args.length == 2 && args[1] == 'all') {
                settings.commandes.splice(0, settings.commandes.length);
                settings.save();
                return message.channel.sendSuccessMessage(`All custom orders from this guild have been deleted.`);
            } else {
                const title = args[1].toLowerCase()
                let customCommand = settings.commandes.find(e => e.nom == title)
                if (customCommand) {
                    client.updateGuild(message.guild, { $pull: { commandes: { nom: title } } });
                    message.channel.sendSuccessMessage(`I have deleted this command.`)
                } else return message.channel.sendErrorMessage(`Command not found.`)
            }
            break;
    }
};
module.exports.help = {

    name: "commands",
    aliases: ['commands', 'command'],
    category: 'administration',
    description: "Manage custom commands.",
    cooldown: 10,
    usage: '<action> <valeur>',
    exemple: [],
    isUserAdmin: false,
    moderator: true,
    args: false,
    userPermissions: ['MANAGE_GUILD'],
    botPermissions: [],
    subcommands: [
        {
            name: 'list',
            description: 'View commands custom on the guild.',
            usage: '',
            args: 0,
            exemples: []
        },
        {
            name: 'add',
            description: 'Create command on the guild.',
            usage: '<name> <command>',
            args: 2,
            exemples: ['support discord.gg/TC7Qjfs']
        },
        {
            name: 'rem',
            description: 'Remove command of the guild.',
            usage: '<name> | all',
            args: 1,
            exemples: ['support', 'all']
        },
    ]
}