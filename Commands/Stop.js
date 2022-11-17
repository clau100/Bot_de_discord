const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    guild: "",
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the bot')
        .setDefaultMemberPermissions(0)
    ,
    async exec(interaction, client, rest){
        if (interaction.user.id === "324219138560229376") { //if user is Petrilu, you can shut down the bot
            await interaction.reply('Stopping the bot...')
            await client.destroy()
            await process.exit()
        }else{
            await interaction.reply('You are not my dad!')
        }
    },
}
