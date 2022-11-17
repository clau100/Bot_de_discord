const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config');
const fs = require('node:fs');

const global_commands = [];
const guild_commands = new Map();
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.guild === '') {
    global_commands.push(command.data.toJSON());
  }else{
    if (guild_commands.get(command.guild) !== undefined){
      let crt = guild_commands.get(command.guild);
      crt.push(command.data.toJSON());
      guild_commands.set(command.guild, crt);
    }else{
      guild_commands.set(command.guild, [command.data.toJSON()]);
    }
  }
}
// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${global_commands.length + guild_commands.size} application (/) commands.`);
    // The put method is used to fully refresh all commands in the guild with the current set
    console.log("ALL GLOBAL COMMANDS:");
    for (let comm of global_commands){
      console.log(comm);
    }
    console.log("###########################################################");
    console.log("ALL GUILD COMMANDS:");
    for (let comm of guild_commands){
      console.log(comm);
    }
    let len = 0;
    const data1 = await rest.put(
        Routes.applicationCommands(clientId),
        { body: global_commands },
    );
    len += data1.length
    for (const guildID of guild_commands.keys()){
      const data2 = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body:  guild_commands.get(guildID)},
      )
      len += data2.length
    }

    console.log(`Successfully reloaded ${len} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();