const generateRandomInt = (max) =>{ //generates a random int from 1 - max, including
    return Math.floor(Math.random() * max) + 1;
}
const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    guild: "",
    data: new SlashCommandBuilder()
        .setName('howgay')
        .setDescription('Checks how gay the given input is!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        ),


    async exec(interaction, client, rest){
        perc = generateRandomInt(100)
        resp = `is ${perc}% gay`;
        resp += `!`;
        if (perc >= 50){
            resp += `🏳️‍🌈`;
        }
        const value = interaction.options.getString('input');
        return interaction.reply(`${value} ${resp}`)
    },
}
