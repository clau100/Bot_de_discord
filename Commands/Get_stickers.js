const {SlashCommandBuilder} = require("discord.js");
let guild_sticker = new Map();

const read = async () =>{
    const fs = require('fs');
    await fs.readFile('sticker_map.json', (err, data) =>{
        if (err) throw err;
        let arr = JSON.parse(data);
        for (let el in arr){
            if(guild_sticker.get(el.guild) === undefined){
                guild_sticker.set(el.guild, [el.sticker]);
            }else{
                arr = guild_sticker.get(el.guild);
                arr.push(el.sticker);
                guild_sticker.set(el.guild, arr);
            }
        }
    });
}

const write = async () =>{
    const fs = require('fs');
    let arr = [];
    for (let gld of guild_sticker.keys()){
        for (let stckr of guild_sticker.get(gld)){
            arr.push({guild: gld,sticker: stckr})
        }
    }
    const data = JSON.stringify(arr);
    await fs.writeFile('sticker_map.json', data, (err) =>{
        if (err) throw err;
    });
}

module.exports = {
    guild: "",
    data: new SlashCommandBuilder()
        .setName('get_stickers')
        .setDescription('Debug command for getting stickers from a server!')
    ,
    async exec(interaction, client, rest){
        await interaction.reply("Reading saved stickers...");
        await read();
        await interaction.editReply(`Getting all stickers from ${interaction.guild.name}!`);
        client.guilds.resolve(interaction.guild).stickers.cache.forEach(value => {
            if (guild_sticker.get(interaction.guild.name) === undefined){
                guild_sticker.set(interaction.guild.name, [value]);
            }else{
                let arr = guild_sticker.get(interaction.guild.name);
                let found = false;
                for (let sticker of arr){
                    if (sticker === value){
                        found = true;
                    }
                }
                if (found) return;
                arr.push(value);
                guild_sticker.set(interaction.guild.name,arr);
            }
        })
        await interaction.editReply(`Got all stickers from ${interaction.guild.name}!`);
        await write();
        await interaction.editReply("Saved all stickers!");
    },
}
