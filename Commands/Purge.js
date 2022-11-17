const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    guild: "",
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes the last n messages!')
        .addIntegerOption( option =>
            option
            .setName('number_to_delete')
            .setDescription('The number of messages to delete')
            .setRequired(true)
        ),


    async exec(interaction, client, rest) {
        const channel = interaction.channel;
        let nr = 0;
        await channel.bulkDelete(interaction.options.getInteger('number_to_delete'))
            .then(messages => {
                nr = messages.size;
            })
            .catch(console.error);
        return interaction.reply({content: `Bulk deleted ${nr} messages!`, ephemeral: true});
    },
}