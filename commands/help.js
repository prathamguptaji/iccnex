const Discord = require('discord.js');

module.exports={
   async execute(message,args){

    const embed = Discord.MessageEmbed()
    embed.setField("test")
    message.channel.send(embed)
    }
}