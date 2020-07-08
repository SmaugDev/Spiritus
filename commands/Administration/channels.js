const {MessageEmbed} = require('discord.js')
module.exports.run = async(client, message, args,settings) => {
    if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas la permission de modifier ce channel.`);
    if(!args[0]){
        const embed = new MessageEmbed()
        .setTitle('Commande channel')
        .setDescription('La commande `channel` permet de gérer les channels du serveur graces aux sous commandes suivantes :')
        .setColor(`${client.config.color.EMBEDCOLOR}`)
        .addFields(
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel clone\` permet de cloner facilement n\`importe quel channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel position\` change la position de n'importe quel channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel parent\` change la categorie de n'importe quel channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel synchro\` permet de synchroniser les permission d\`un channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel topic\` permet de choisir le channel d\`un channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel create\` permet de crée un channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel update\` permet de mettre a jour le nom d'un channel.`, inline: false },
            { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel delete\` permet de supprimer un channel.`, inline: false },
           // { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel pin\` permet de pin un message avec son id.`, inline: false },
           // { name: '\u200b', value: `${client.config.emojis.FLECHE}\`channel unpin\` permet de unpin un message avec son id.`, inline: false },
        )
        .setTimestamp()
        .setFooter('BOT ID : 689210215488684044')
        return message.channel.send(embed)
    }
    if(args[0].toLowerCase() === 'clone'){
        const channelCloneDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel clone`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de cloner un channel\n**Usage :** [nom/id/mention]\n**Exemples :** \n ${settings.prefix}channel clone 716993025678639124 \n ${settings.prefix}channel clone #blabla`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelCloneDescription)
        let channel = client.resolveChannel(message.guild, args[1])
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        try{
            channel.clone().then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien cloner le channel \`${channel.name}\``))
        }catch(err){
            message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite merci de réessayer`);
            client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-delete\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            return;
        };
    }
    if(args[0].toLowerCase() === 'synchro'){
        const channelSynchroDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel synchro`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de synchroniser les permissions d'un channel avec sa catégorie\n**Usage :** [nom/id/mention]\n**Exemples :** \n ${settings.prefix}channel synchro 716993025678639124 \n ${settings.prefix}channel synchro #blabla`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelSynchroDescription)
        let channel = client.resolveChannel(message.guild, args[1])
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        if(!channel.parent) return message.channel.send(`${client.config.emojis.FALSE}Le salon n'est dans aucune catégorie.`)
        try{
            channel.lockPermissions()
            .then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien synchroniser les permissions du channel ${channel.name} avec les permissions de la catégorie ${channel.parent.name}`))
          }catch(err){
            message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite merci de ressayer`)
            client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-synchro\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
          }

    }
    if(args[0].toLowerCase() === 'create'){
        const channelCreateDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel create`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :**  Permet de crée un channel ou une catégorie\n**Usage :** [text/voice/category] (name)\n**Exemples :** \n ${settings.prefix}channel create text Spiritus\n ${settings.prefix}channel create category Spiritus`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        var category = message.channel.parentID
        if(!args[1]) return message.channel.send(channelCreateDescription)
        if(args[1] == 'text' || args[1] == 'voice') {
            try{
                let nameChannel = args.splice(2).join('-')
                if(!nameChannel)return message.channel.send(`${client.config.emojis.FALSE}Merci de préciser un nom au channel.`);
                if(nameChannel.length > 99) return message.channel.send(`${client.config.emojis.FALSE}Le nom de la categorie doit etre inferieur a 100 caractères.`);
                message.guild.channels.create(`${nameChannel}`, {
                    type: `${args[1]}`,
                    }).then(chan => {
                    chan.setParent(category).then(e => { // On met le nouveau channel dans la bonne catégorie
                  }).then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien crée le salon ${nameChannel}`))
                  .catch(console.error);
                })
                .catch(console.error);
            }catch(err){
                message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite merci de réessayer`);
                client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-create\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
                return;
            };

        }else if(args[1] == 'category'){
            let nom_category = args.splice(2).join(' ')
            if(nom_category.length > 99) return message.channel.send(`${client.config.emojis.FALSE}Le nom de la categorie doit etre inferieur a 100 caractères.`);
            message.guild.channels.create(`${nom_category}`, {
                type: `${'category'}`,
                
                }).then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien crée la catégorie ${nom_category}`))
                .catch(console.error)

        }else{
            return message.channel.send(`${client.config.emojis.FALSE}Veuillez donner en premier argument une valeur valide (\`text\` ou \`voice\` ou \`category\`)`)
        }
    } 
    if(args[0].toLowerCase() === 'update'){
        const channelUpdateDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel update`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de modifier un channel\n**Usage :** [Ancion nom/id/mention] [Nouveau nom]\n**Exemples :** \n ${settings.prefix}channel update 716993025678639124 💬general\n ${settings.prefix}channel update #blabla Général`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelUpdateDescription)
        if(!args[2]) return message.channel.send(`${client.config.emojis.FALSE}Merci de spécifier le nouveau nom du channel a modifier`)
        let channel = client.resolveChannel(message.guild, args.slice(1).join('-'))
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        if(channel){
            try{
               await channel.edit({ name: args.slice(2).join("-") }).then(
                    message.channel.send(`${client.config.emojis.TRUE}J'ai bien mis a jour le channel \`${channel.name}\``)
                )//.catch(message.channel.send(`Une erreur s'est produite. Merci de réessayer`))
            }catch(err){
                client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-update\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            }
        }else{
            message.channel.send(`${client.config.emojis.FALSE}Je n\'ai pas trouver ce channel...`)
        }
    }
    if(args[0].toLowerCase() === 'delete'){
        const channelDeleteDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel delete`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de supprimer un channel\n**Usage :** (nom/id/mention)\n**Exemples :** \n ${settings.prefix}channel delete 716993025678639124\n ${settings.prefix}channel delete #blabla`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1])return message.channel.send(channelDeleteDescription)
        let channel = client.resolveChannel(message.guild, args.slice(1).join('-'))
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        try{
            channel.delete().then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien supprimer le channel ${channel.name}`))
        }catch (err){
            message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite merci de réessayer`);
            client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-delete\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            return;
        }
 
    }
    if(args[0].toLowerCase() === 'position'){
        const channelPositionDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel position`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de modifier la position d'un channel\n**Usage :** (nom/id/mention) (position)\n**Exemples :** \n ${settings.prefix}channel position 716993025678639124 5\n ${settings.prefix}channel position #blabla 5`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelPositionDescription)
        if(!args[2]) return message.channel.send(`${client.config.emojis.FALSE}Merci de spécifier la nouvelle position du channel`)
        let channel = client.resolveChannel(message.guild, args[1])
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        let positionNew = args[2]
        if(isNaN(positionNew)) return message.channel.send(`${client.config.emojis.FALSE}Merci de rentrer un nombre valide pour la position du channel`)
        if(channel){
            try{
               await channel.setPosition(positionNew-1).then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien mis a jour la position du channel \`${channel.name}\``))
            }catch(err){
                client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-update-position\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            }
        
        }
    }
    if(args[0].toLowerCase() === 'parent'){
        const channelParentDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel parent`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de modifier la categorie d'un channel\n**Usage :** (nom/id/mention) (categorieID)\n**Exemples :** \n ${settings.prefix}channel position 716993025678639124 716992798506876980\n ${settings.prefix}channel position #blabla 716992798506876980`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelParentDescription)
        if(!args[2]) return message.channel.send(`${client.config.emojis.FALSE}Merci de spécifier la nouvelle position du channel`)
        let channel = client.resolveChannel(message.guild, args[1])
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        let category = client.resolveChannel(message.guild, args.slice(2).join(" "))
        if(category == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver cette categorie.`)
        if(isNaN(category)) return message.channel.send(`${client.config.emojis.FALSE}Merci de rentrer un ID valide pour la nouvelle categorie du salon`)
            try{
               await channel.setParent(category).then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien mis a jour la position du channel \`${channel.name}\``))
            }catch(err){
                message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite, merci de réessayer`)
                client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-update-position\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            }
      
        }
    
    if(args[0].toLowerCase() === 'topic'){
        const channelTopicDescription = new MessageEmbed()
        .setTitle(`Sous commande : ${settings.prefix}channel topic`)
        .setColor(client.config.color.EMBEDCOLOR)
        .setDescription(`**Module :** Manangement\n**Description :** Permet de modifier le topic d'un channel\n**Usage :** [nom/id/mention] (Nouveau topic)\n**Exemples :** \n ${settings.prefix}channel topic 716993025678639124 Nouveau topic\n ${settings.prefix}channel position #blabla Nouveau topic`)
        .setFooter('BOT ID : 689210215488684044')
        .setTimestamp()
        if(!args[1]) return message.channel.send(channelTopicDescription)
        if(!args[2]) return message.channel.send(`${client.config.emojis.FALSE}Merci de spécifier le nouveau topic`)
        let channel = client.resolveChannel(message.guild, args[1])
        if(channel == undefined)return message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce channel.`)
        let newTopic = args.slice(2).join(" ")
        if(newTopic.length > 1020)return message.channel.send(`${client.config.emojis.FALSE}Vous ne pouvez pas crée un topic de plus de 1024 caractères !`)
            try{
               await channel.setTopic(newTopic).then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien mis a jour le topic du channel \`${channel.name}\``))
            }catch(err){
                client.channels.cache.get('725251200660013136').send(`Une erreur sur la commande \`channel-topic\` s'est produite sur le serveur : ${message.guild.name}.\n\`ERREUR :\`\n\`\`\`xl\n${err}\`\`\``);
            }
    }
   /* if(args[0].toLowerCase() === 'pin'){
        try{
            if(isNaN(args[1])) return message.channel.send(`${client.config.emojis.FALSE}Merci de rentrer un id de message valide.`)
            let channel = message.channel
            let test = message.channel.messages.cache.get('726710021399904267')
            console.log(test)
            //.pin().then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien épingler le message \`${args[1]}\``))

        }catch(err){
            message.channel.send(`${client.config.emojis.FALSE}Une erreur s'est produite merci de réessayer avec un id de message valide ou vérifiez que le message n'est pas déja épingler (erreur : ${err})`)
        }
    }
    if(args[0].toLowerCase() === 'unpin'){
        try{
            if(isNaN(args[1])) return message.channel.send(`${client.config.emojis.FALSE}Merci de rentrer un id de message valide.`)
            message.channel.messages.cache.get(args[1]).unpin().then(message.channel.send(`${client.config.emojis.TRUE}J'ai bien retirer le message \`${args[1]}\` des messages épinglés`))

        }catch{
            message.channel.send(`${client.config.emojis.FALSE}Je n'ai pas trouver ce message`)
        }
    }*/
    
    
}
module.exports.help = {
    name: "channel",
    aliases: ['channel','channels'],
    category : 'administration',
    description: "Permet de gérer les channels du serveur",
    cooldown: 5,
    usage: '<action> <args>',
    exemple :[],
    isUserAdmin: false,
    permissions: true,
    args: false,
    sousCommdandes : ["channel clone","channel position","channel parent","channel synchro","channel topic","channel create","channel update","channel delete","channel pin","channel unpin"]
  };