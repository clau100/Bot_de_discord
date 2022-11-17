const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
module.exports = {
    guild: "",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the delay between the bot and the server!')
    ,
    async exec(interaction, client, rest){
        let mess = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Ping!')
            .setDescription('Calculating the round trip ping!')
            .setTimestamp();
        const start_time = performance.now();
        await interaction.reply({embeds: [mess]});
        mess
            .setColor(0x00FF00)
            .setTitle('🏓Pong!')
            .setDescription(`Round trip ping: ${Math.round((performance.now() - start_time)*1000)/1000}ms`)
            .setTimestamp()
        await interaction.editReply({embeds: [mess]});
    },
}
