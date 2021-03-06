module.exports.run = async (client, message, args) => {
    if (!client.config.ADMIN.includes(message.author.id)) return message.channel.sendErrorMessage(`Tu n'est pas admin du BOT `)
    //---------------------------------------PREMIUM-ADD---------------------------------------------------
    if (args[0] === 'add') {
        const guild = {
            id: `${args[1]}`
        }
        await client.updateGuild(guild, { premium: true });
        message.channel.sendSuccessMessage(`Guild premium updated.`)
    }
    //---------------------------------------PREMIUM-REM---------------------------------------------------
    if (args[0] === 'rem') {
        const guild = {
            id: `${args[1]}`
        }
        await client.updateGuild(guild, { premium: false });
        message.channel.sendSuccessMessage(`Guild premium updated.`)
    }
}
module.exports.help = {

    name: 'premium',
    aliases: ['premium'],
    category: 'admin',
    description: 'Update premium guild.',
    cooldown: 5,
    usage: '',
    exemple: [],
    moderator: false,
    isUserAdmin: false,
    args: true,
    subcommands: []
}
